const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { requireAuth, requireOrganizationAccess } = require("./middleware/auth");
const { fetchLogtoManagementApiAccessToken } = require("./lib/utils");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Organizations routes
app.post(
  "/organizations",
  requireAuth("https://api.documind.com"),
  async (req, res) => {
    
    const accessToken = await fetchLogtoManagementApiAccessToken();
    // Create organization in Logto
    const response = await fetch(`${process.env.LOGTO_ENDPOINT}/api/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: req.body.name,
        description: req.body.description,
      }),
    });
    
    const createdOrganization = await response.json();

    // Add user to organization in Logto
    await fetch(`${process.env.LOGTO_ENDPOINT}/api/organizations/${createdOrganization.id}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userIds: [req.user.id],
      }),
    });

    // Assign `Admin` role to the first user.
    const rolesResponse = await fetch(`${process.env.LOGTO_ENDPOINT}/api/organization-roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const roles = await rolesResponse.json();

    // Find the `Admin` role
    const adminRole = roles.find(role => role.name === 'Admin');

    // Assign `Admin` role to the first user.
    await fetch(`${process.env.LOGTO_ENDPOINT}/api/organizations/${createdOrganization.id}/users/${req.user.id}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        organizationRoleIds: [adminRole.id],
      }),
    });

    res.json({ data: createdOrganization });
  }
);

// Documents routes
app.get(
  "/documents",
  requireOrganizationAccess({ requiredScopes: ["read:documents"] }),
  async (req, res) => {
    console.log("userId", req.user.id);
    console.log("organizationId", req.user.organizationId);
    // Get documents from the database by organizationId
    // ....
    // Mock data matching the frontend
    const documents = [
      {
        id: '1',
        title: 'Getting Started Guide',
        updatedAt: '2024-03-15',
        updatedBy: 'John Doe',
        preview: 'Welcome to DocuMind! This guide will help you understand the basic features...'
      },
      {
        id: '2',
        title: 'Product Requirements',
        updatedAt: '2024-03-14',
        updatedBy: 'Alice Smith',
        preview: 'The new feature should include the following requirements...'
      }
    ];

    res.json(documents);
  }
);

app.post(
  "/documents",
  requireOrganizationAccess({ requiredScopes: ["create:documents"] }),
  async (req, res) => {
    // Create document in the database
    // ....
    res.json({ data: "Document created" });
  }
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

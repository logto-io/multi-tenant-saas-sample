import { useLogto } from "@logto/react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../env";

type TopbarProps = {
  organizationId?: string;
  showBackButton?: boolean;
};

const Topbar = ({ organizationId, showBackButton }: TopbarProps) => {
  const { signOut } = useLogto();
  const navigate = useNavigate();

  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DocuMind
            </h1>
            {organizationId && (
              <div className="ml-4 flex items-center">
                <span className="text-sm text-gray-500">
                  Organization: {organizationId}
                </span>
                {showBackButton && (
                  <button
                    onClick={() => navigate("/")}
                    className="ml-2 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {organizationId && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Enterprise Plan
              </span>
            )}
            <button
              onClick={() => signOut(APP_ENV.app.signOutRedirectUri)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar; 
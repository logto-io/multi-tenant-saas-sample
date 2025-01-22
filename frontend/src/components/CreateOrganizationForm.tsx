import { useState } from 'react';
import { useResourceApi } from '../api/resource';

interface CreateOrganizationFormProps {
  onSuccess: (orgId: string) => void;
}

const CreateOrganizationForm = ({ onSuccess }: CreateOrganizationFormProps) => {
  const { createOrganization } = useResourceApi();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);
    
    try {
      const result = await createOrganization(formData);
      setFormData({ name: '', description: '' });
      onSuccess(result.data.id);
    } catch (error) {
      setError(`Failed to create organization. Please try again. ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClassName = "mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 placeholder-gray-400";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Your First Organization</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Organization Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={inputClassName}
            placeholder="Enter organization name"
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={inputClassName}
            placeholder="Enter organization description"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-lg">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 ease-in-out shadow-sm"
        >
          {isCreating ? 'Creating...' : 'Create Organization'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrganizationForm; 
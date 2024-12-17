import React from 'react';
import { useForm } from 'react-hook-form';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useAuthStore } from '../../stores/authStore';

interface CreateWorkspaceFormData {
  name: string;
}

export default function CreateWorkspaceForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateWorkspaceFormData>();
  const createWorkspace = useWorkspaceStore(state => state.createWorkspace);
  const user = useAuthStore(state => state.user);
  const setWorkspace = useAuthStore(state => state.setWorkspace);

  const onSubmit = async (data: CreateWorkspaceFormData) => {
    if (!user) return;
    
    try {
      const workspace = await createWorkspace(data.name, user.id);
      setWorkspace(workspace);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary">
          Nom du workspace
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true })}
          className="mt-1 glass-input px-4 py-2"
          placeholder="Ex: SAGT Abidjan"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">Nom requis</p>
        )}
      </div>

      <button type="submit" className="w-full glass-button active">
        Créer le workspace
      </button>
    </form>
  );
}
import React from 'react';
import { useForm } from 'react-hook-form';
import { useWorkspaceStore } from '../../stores/workspaceStore';

interface InviteMemberFormData {
  email: string;
  role: 'admin' | 'operator';
}

interface InviteMemberFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export default function InviteMemberForm({ workspaceId, onSuccess }: InviteMemberFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteMemberFormData>();
  const inviteMember = useWorkspaceStore(state => state.inviteMember);

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      await inviteMember(workspaceId, data.email, data.role);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="mt-1 glass-input px-4 py-2"
          placeholder="collaborateur@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">Email requis</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-text-primary">
          Rôle
        </label>
        <select
          id="role"
          {...register('role', { required: true })}
          className="mt-1 glass-input px-4 py-2"
        >
          <option value="operator">Opérateur</option>
          <option value="admin">Administrateur</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">Rôle requis</p>
        )}
      </div>

      <button type="submit" className="w-full glass-button active">
        Inviter
      </button>
    </form>
  );
}
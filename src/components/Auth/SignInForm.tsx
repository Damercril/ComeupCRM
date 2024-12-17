import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { AuthError } from '@supabase/supabase-js';

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>();
  const signIn = useAuthStore(state => state.signIn);
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: SignInFormData) => {
    try {
      setAuthError(null);
      await signIn(data.email, data.password);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.message) {
          case 'Email not confirmed':
            setAuthError('Veuillez confirmer votre email avant de vous connecter.');
            break;
          case 'Invalid login credentials':
            setAuthError('Email ou mot de passe incorrect.');
            break;
          default:
            setAuthError('Une erreur est survenue lors de la connexion.');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {authError && (
        <div className="p-4 glass-card border-accent-warning/50 bg-accent-warning/10">
          <p className="text-sm text-accent-warning">{authError}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="mt-1 glass-input px-4 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">Email requis</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          {...register('password', { required: true })}
          className="mt-1 glass-input px-4 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">Mot de passe requis</p>
        )}
      </div>

      <button 
        type="submit" 
        className="w-full glass-button active"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Connexion...
          </div>
        ) : (
          'Se connecter'
        )}
      </button>
    </form>
  );
}
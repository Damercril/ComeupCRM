import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { AuthError } from '@supabase/supabase-js';

interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
}

export default function SignUpForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>();
  const signUp = useAuthStore(state => state.signUp);
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setAuthError(null);
      await signUp(data.email, data.password, data.fullName);
      setSuccess(true);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.message) {
          case 'User already registered':
            setAuthError('Un compte existe déjà avec cet email.');
            break;
          default:
            setAuthError('Une erreur est survenue lors de l\'inscription.');
        }
      }
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="glass-card p-6 border-accent-success/50 bg-accent-success/10">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Inscription réussie !
          </h3>
          <p className="text-text-secondary">
            Un email de confirmation vous a été envoyé. Veuillez confirmer votre email pour vous connecter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {authError && (
        <div className="p-4 glass-card border-accent-warning/50 bg-accent-warning/10">
          <p className="text-sm text-accent-warning">{authError}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-text-primary">
          Nom complet
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', { required: true })}
          className="mt-1 glass-input px-4 py-2"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">Nom complet requis</p>
        )}
      </div>

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
          {...register('password', { required: true, minLength: 6 })}
          className="mt-1 glass-input px-4 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            Mot de passe requis (minimum 6 caractères)
          </p>
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
            Inscription...
          </div>
        ) : (
          'S\'inscrire'
        )}
      </button>
    </form>
  );
}
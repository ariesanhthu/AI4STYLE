'use client'

import { useState } from 'react';
import { roleService } from '../services/role.service';
import { RoleCreateRequest, RoleUpdateRequest } from '../types/role.type';

export function useRoleMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRole = async (data: RoleCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await roleService.createRole(data);
      return { ok: true, data: result };
    } catch (err: any) {
      setError(err.message || 'Failed to create role');
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, data: RoleUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await roleService.updateRole(id, data);
      return { ok: true, data: result };
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await roleService.deleteRole(id);
      return { ok: true };
    } catch (err: any) {
      setError(err.message || 'Failed to delete role');
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createRole,
    updateRole,
    deleteRole,
    loading,
    error
  };
}

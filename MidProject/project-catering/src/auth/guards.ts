// src/auth/guards.ts
import { RolesGuard } from './roles.guard';

export const AdminGuard = new RolesGuard('admin');
export const CustomerGuard = new RolesGuard('customer');
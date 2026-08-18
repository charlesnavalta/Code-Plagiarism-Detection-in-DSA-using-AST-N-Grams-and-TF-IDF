// InstructorWrapper.js — Backward-compatible re-export.
// The actual component now lives in components/dashboard/DashboardLayout.
// This file is kept so InstructorClassroomView.js and StudentClassroomView.js
// continue to work without changing their imports.
import '../../../style/InstructorTheme.css';
import './InstructorShared.css';
export { default } from '../../../components/dashboard/DashboardLayout';
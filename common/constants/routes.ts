export const enum AppRoutes {
  Menu = "/menu",
  Dashboard = "/dashboard",
  EditDashboard = "/dashboard/edit",
  Login = "/auth/login",
  Register = "/auth/register",
  ProfileList = "/profile/list",
  AddCaretakerProfile = "/profile/caretaker/add",
  ScanSeniorQR = "/profile/caretaker/scan-qr",
  DisplaySeniorQR = "/profile/senior/display-qr",
  AlertHistory = "/alert/history",
  Medication = "/medication",
  Games = "/games",
  Notes = "/notes",
  NoteDetails = "/notes/[noteId]",
  CreateNote = "/notes/create",
}

export const MIN_DISPLAY_NAME_LENGTH = 3;

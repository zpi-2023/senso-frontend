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
  MedicationList = "/medication",
  IntakeHistory = "/medication/history",
  Games = "/games",
  MemoryGame = "/games/memory",
  NoteList = "/notes",
  NoteDetails = "/notes/[noteId]",
  CreateNote = "/notes/create",
  EditNote = "/notes/[noteId]/edit",
}

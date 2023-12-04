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
  SeniorCaretakerList = "/profile/senior/caretakers",
  AlertHistory = "/alert/history",
  MedicationList = "/medication",
  ReminderDetails = "/medication/reminders/[reminderId]",
  IntakeHistory = "/medication/history",
  Games = "/games",
  GameScoreboard = "/games/[gameName]/scoreboard",
  MemoryGame = "/games/memory",
  GraydleGame = "/games/graydle",
  SudokuGame = "/games/sudoku",
  NoteList = "/notes",
  NoteDetails = "/notes/[noteId]",
  CreateNote = "/notes/create",
  EditNote = "/notes/[noteId]/edit",
}

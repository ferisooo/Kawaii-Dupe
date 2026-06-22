' ============================================================
'  DupeNova silent launcher
'  Double-click this instead of start.bat to run with NO
'  console window. It runs start.bat hidden, logs output to
'  launch.log, and only shows a popup if something fails.
' ============================================================
Option Explicit

Dim sh, fso, base, bat, logf, q, cmd, code, firstRun
Set sh  = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

base = fso.GetParentFolderName(WScript.ScriptFullName)
bat  = base & "\start.bat"
logf = base & "\launch.log"
q    = Chr(34)

If Not fso.FileExists(bat) Then
  MsgBox "start.bat was not found next to this launcher.", 16, "DupeNova"
  WScript.Quit 1
End If

firstRun = Not fso.FolderExists(base & "\node_modules")

' tell start.bat it is running hidden so it won't wait on pause prompts
sh.Environment("PROCESS")("DUPENOVA_HIDDEN") = "1"

If firstRun Then
  MsgBox "Setting up DupeNova for the first time." & vbCrLf & vbCrLf & _
         "This can take a minute. Nothing will be visible while it works " & _
         "- the app window opens automatically when it's ready.", 64, "DupeNova"
End If

' cmd /c ""<bat>" > "<log>" 2>&1"   (window style 0 = hidden, wait = True)
cmd = "cmd /c " & q & q & bat & q & " > " & q & logf & q & " 2>&1" & q
code = sh.Run(cmd, 0, True)

If code <> 0 Then
  MsgBox "DupeNova couldn't start." & vbCrLf & vbCrLf & _
         "Details were saved to:" & vbCrLf & logf, 16, "DupeNova"
End If

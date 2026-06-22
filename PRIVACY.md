# Privacy Policy

**Application:** DupeNova ✦ duplicate purifier (the "App")
**Author:** White Cat Feris (`ferisooo`) (referred to here as "the Author")
**Last updated:** 22 June 2026

**Short version: DupeNova does not collect anything from you.** It has no accounts, no
sign-up, no analytics, and no tracking. It does not send your files, your file names, or
any information about you to the Author or anyone else. Everything the App does happens
locally on your own computer.

This policy explains that in detail and is written to be honest and complete.

---

## 1. We do not collect your data

The Author **does not collect, store, receive, transmit, sell, share, or have any access
to** any information about you or your use of the App. Specifically, the App does **not**:

- collect personal information (no name, email, address, phone number, or account);
- require you to register, log in, or create an account;
- include analytics, telemetry, usage tracking, advertising, or crash reporting;
- send your files, the contents of your files, file names, folder paths, or file hashes
  anywhere;
- maintain any server, database, or cloud service that receives your information;
- use cookies or similar tracking technologies.

There is no "back end." The Author never sees what you scan or delete because that
information never leaves your machine.

---

## 2. How your files are handled (all locally)

When you use the App, all processing happens **on your own computer**:

- **Scanning:** The App reads the files inside the folder *you* choose, in order to
  compare them and find byte-for-byte duplicates. This reading happens locally and the
  results are only ever shown to you, on your own screen.
- **Hashing:** To compare files, the App computes a SHA-256 hash of file contents on
  your machine. These hashes are kept only in memory during the scan and are never
  uploaded or saved to a remote location.
- **Deleting:** When you choose to purge duplicates, the App moves those copies to your
  operating system's **Recycle Bin** using the OS's own function. Files are not
  permanently deleted by the App and can be restored by you from the Recycle Bin until
  you empty it.

The Author has no access to any of this.

---

## 3. Network connections

DupeNova is designed to work fully offline, and **no internet connection is required to
find or remove duplicates.** For transparency, here are the only times the App or its
launcher may contact the internet, and none of these send any of your personal data or
file data to the Author:

- **Google Fonts (optional, cosmetic).** When your computer is online, the App's window
  may load decorative fonts from Google's font servers (`fonts.googleapis.com` and
  `fonts.gstatic.com`) to look nicer. As with loading any web font, this means Google's
  servers receive a standard request from your device (which can include your IP address
  and basic request information), and this is governed by **Google's own privacy
  policy**, not the Author's. If you are offline, the App automatically falls back to
  your system fonts and makes no such request. No information about your files is ever
  included in these requests.
- **First-time setup downloads.** The first time you launch it, the included launcher
  (`start.bat` / `DupeNova.vbs`) downloads the open-source components the App needs
  (such as the Electron runtime and other dependencies) from public package registries
  and GitHub. These are normal software downloads to set up the App; they do not send
  the Author any information about you, and they do not transmit your files.

The Author does not receive any data from any of these connections.

---

## 4. Data stored on your device

The App may create local files on your own computer for normal operation, such as a
`launch.log` file (which records technical launcher output to help you troubleshoot) and
the installed program/dependency files. These stay on your device, under your control.
The Author has no access to them. You can delete them at any time.

---

## 5. Children's privacy

Because the App collects no personal information from anyone, it collects none from
children. The App is a general-purpose file utility and is not directed at children.

---

## 6. Your control

Because nothing is collected, there is nothing for the Author to access, correct, export,
or delete on your behalf. You remain in full control of your own device, your files, your
Recycle Bin, and any local files the App creates.

---

## 7. Third-party software

The App is built on third-party open-source software (including Electron, Node.js, React,
and esbuild) and may load Google Fonts when online. These components are governed by
their own licenses and privacy practices. This Privacy Policy covers only the DupeNova
App as distributed by the Author and does not cover third parties' own services.

---

## 8. Forked or modified versions

This Privacy Policy describes the **official version of DupeNova as distributed by the
Author**. Anyone is free to fork or modify the App (see [`TERMS.md`](TERMS.md)). The
Author is **not responsible** for the privacy practices, data handling, added tracking,
or behavior of any modified, forked, repackaged, or third-party version of the App. If
you use a version you did not obtain from the Author, you should review that version's
own terms and behavior.

---

## 9. Changes to this policy

The Author may update this Privacy Policy from time to time. The version of this policy
included with a given release applies to that release. Continued use of the App after an
update means you accept the updated policy.

---

## 10. "As is" and liability

The App and this policy are provided on an "as is" basis. To the maximum extent permitted
by law, the Author is not liable for any loss or damage arising from your use of the App
or from any third-party service the App may connect to. See [`TERMS.md`](TERMS.md) for the
full terms and limitation of liability.

---

*DupeNova — original concept by White Cat Feris (ferisooo) 🐾, original implementation by
Claude (Anthropic).*

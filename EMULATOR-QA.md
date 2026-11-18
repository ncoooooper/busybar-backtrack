# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Set a custom next action, parked Review, switched contexts, jumped to the most recent interruption, quit and relaunched. The exact saved action returned and resumed via click. Back exited cleanly (71.2 KiB peak).

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.

Firmware motion pass: up, ok, start. 16 distinct frames in the controls recording. App io.ncoooooper.backtrack exited: finished; heap peak 81.6 of 128 KiB.

## Display capture

Firmware 1.3.1 rendered both README examples. Each square in a guide GIF is one front LED in a 16 × 16 cell. The production archive was built from the source in this repository.

## Screen transition capture

Firmware 1.3.1 rendered the display sequences in the README. The guide uses a 14 × 14 lit area inside each 16 × 16 cell. Input sequences, frame counts and the release archive checksum are in [the capture record](media/screen-transitions.json).

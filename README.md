# FGD Parser
FGD Parser is a project that started in Python some time ago with the use of GUI Library TKInter, while some initial versions indeed happen, a lot of the potential and capabilities were just
not enough for the project to shine.

At this point the project was switched to React with Flask as a backend, and ended up being a pure react web project... as the project is intended to solve but also automate the task of FGD file preview within
the videogame modding community (Quake specifically) and any videogame game development group or sector that handles Trenchbroom and FGD files.

The script is called csvfgdparser because initially it generated a csv file, that function was kept for the final product.

Author: Absolute Quantum (AQ) development team (Chuma, Nepta and Dany).

## Technical Aspects / Technical Content
The script is made out of React (Javascript language), there are some remnants in some branches of Python (possibly this one) but it doesn't work, what Python initially in backend was the parsing and file handling.

# Instructions on how to use the Website.

<img width="965" height="794" alt="image" src="https://github.com/user-attachments/assets/4152b7fc-1a9a-4620-862c-329c2fc722ed" />

This script is very simple in function, An FGD file is required, the one that's going to be used is Quake.fgd file, said file can be found in this repository along with others from popular mods.

Once Quake.fgd file is loaded, the screen will change with the Quake.fgd loaded... i've made some color lines to talk about the functions in a structured fashion:

<img width="1047" height="880" alt="image" src="https://github.com/user-attachments/assets/e7df4ebc-dc5e-4c6a-889f-64b1e3edfa90" />

The comboboxes will let you select which entity files the user would like to see (Solid, Point and Base classes or by default all of them)

The buttons:
- "Download CSV" will allow the user to download the CSV file of this parsing or well "Data visualization" of the FGD file.
- "Reset" cleans all the information of the script, this is an important key button, once the user finished looking for the information of the FGD file, and would like to load another, it's recommended for information accuracy (informally:
please DO use the reset button) to use the button, as it will clean all the remaining information in the web's cache (also due to UTF-8 file type it's a bit complicated to clean residual information).

The Note: "Entity counter is an approximation" is a disclaimer as early iteration of the script didn't have a proper numbered entity count and sometimes would miss, while in new iterations the counter do work
due to the UTF-8 file type it's possible to miss that count by little, and since FGD files for bigger and complex Quake mods (not counting a Godot game for example) have a lot of entities, it would consume time to verify this, so the counter should be accounted as an approximate.
Regardless some Quake modders have guaranteed the number counter has been exact. (as a fun fact, the initial python script multiplied the entity counter by 2 and it had to be divided)

When you go lower on the website, you will the 3 generated list of entities (Solid, Point and Base class):

<img width="852" height="880" alt="image" src="https://github.com/user-attachments/assets/bdb5c24a-0d8e-4564-9f45-ef74e68759bc" />

Some entities have a toggle button, this means they have some default valued properties set to them, with their description on the side.

Some other entities don't have default properties attached to them, still they are shown, with an underscore on the left side where the button should be.

# Notes

I do hope everyone is benefitted from this web hosted tool.

The parser was the heaviest part of code that required work, as UTF-8 was a complicated format work with, regardless it was a fun experience from the team perspective to solve this issue.


# Credits
- Chuma (programming, team lead, full-stack)
- Nepta (programming, advice, backend)
- Dany (Testing and Feedback, frontend programming advice)


Special thanks to bmFbr, Paril, CommonCold and Lavender.

Special thanks to:
- Quake Mapping Community (QBSP).
- Pacifist Paradise Community.
All of our family and friends that support us.

Documentation written by Chuma in a formal/semi-formal way while keeping the style.

Personal thanks from me (Chuma) to all my family and friends that support me.
Shine with style!



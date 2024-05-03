<div align="center">
    <a href="https://github.com/Tecanite/better-d2-lfg-experience/">
    <img src="./.github/assets/480.png" width="128" height="128">
    </a>
    <h1>better-d2-lfg-experience</h1>
</div>

chrome extension that adds some useful features to bungie.net fireteam search, raid.report, dungeon.report.

## Features

### bungie.net fireteam search features

- grid layout for fireteam search
- links to a players raid.report and dungeon.report when viewing a fireteam

### raid.report features

- options for a more modern, compact, minimal (WIP) styling
- optional sidebar with quick access to other player reports
- "runs together" functionality that shows how many runs were done together with the viewed profile

### dungeon.report features

- WIP

## Configuration

this extension comes with an options page where all features can be individually configured.
the options page can be accessed by right-clicking the extentions icon in the chrome menu bar and choosing "options"

for the sidebar functionality you have to input your own bungie api key in the settings page. follow the steps below to get one:
- register a dummy application [here](https://www.bungie.net/en/Application)
- you can disable app authentication since its not needed
- put "https://raid.report" under origin header for browser based apps
- accept terms and create app
- copy the automatically generated api key into the text field on the settings page


## Installation

- download the [latest release](https://github.com/Tecanite/better-d2-lfg-experience/releases/latest) from the releases tab
- enable developer mode on chrome extension page (<kbd>Ctrl </kbd>+ <kbd>Shift </kbd> + <kbd>E </kbd> or [chrome://extensions/](chrome://extensions/) or under &#8942; )
- import the zip as an unpacked extension

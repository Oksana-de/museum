# Museum
The **Museum** website is my implementation of the landing page for the [**Louvre**](https://museum-landing.netlify.app).

Styles were written using the **SCSS** preprocessor, functionality was implemented using **TypeScript**, and **Webpack** was used to build the project.

This landing page has an adaptive and responsive PixelPerfect layout.

The design pattern **Mediator** implements user interaction with data on the site in the *Ticket Section* and in the *Booking ticket form*.

Some *animations*, *sliders*, and a *custom video player* in the **Video section** are implemented in the **Museum** website.

1. [Section Welcome](#1-section-welcome)
2. [Section Explore](#2-section-explore)
3. [Section Video (slider)](#3-section-video-slider)
4. [Section Video (custom video player)](#4-section-video-custom-video-player)
5. [Section Gallery](#5-section-gallery)
6. [Ticket Section and Booking ticket form](#6-ticket-section-and-booking-ticket-form)
7. [Form validation](#7-form-validation)
8. [Parallax](#8-parallax)
9. [Section Visiting. Google Street View](#9-section-visiting-google-street-view)

#### 1. Section Welcome
- it is possible to scroll through slides left and right by clicking on the arrows
- it is possible to flip slides left and right using mouse swipes (movements)
- it is possible to scroll through the slides by clicking on the bullets (squares at the bottom of the slider)
- slides scroll smoothly with animation moving to the right or left
- scrolling through slides endlessly (loop)
- when flipping through slides, the bullet of the active slide is highlighted (highlighted with a style)
- when flipping through slides by clicking or swiping, the number of the active slide changes
- even with frequent clicks or swipes, there is no situation when the slide is not centered after flipping, there is no situation when two slides are visible at the same time

#### 2. Section Explore
- the slider can be dragged horizontally with the mouse as well as with the touch
- the slider never goes beyond the borders of the picture
- when moving the slider from right to left, the bottom picture appears smoothly
- when moving the slider from left to right, the top picture appears smoothly
- when the page is refreshed, the slider returns to its original position

#### 3. Section Video (slider)
- when clicking on the slide itself or the Play button in the center of the slide, a YouTube video is played inside the slide. No changes are made to the main video in this case
- `TODO`  if a YouTube video is playing, clicking the Pause button stops it from playing. The video also stops playing if you click on another slide or the Play button in the center of another slide. In this situation, the other video should start and the current video should stop. Unable to play multiple YouTube videos at the same time
- `TODO`  if a YouTube video is playing inside a slide, clicking on the slide flip arrow or clicking on the bullet stops the video playback
- it is possible to flip slides left and right by clicking on the arrows. Slides are flipped one by one, while the main video is also changed
- `TODO` it is possible to flip slides by clicking on bullets (circles at the bottom of the slider), and the main video changes as well
- slides are flipped smoothly with shift animation to the right or left (shift animation is not required or tested for changing the main video)
- slide flipping is infinite (looped)
- when flipping slides, the bullet of the active slide is highlighted (highlighted with style)
- if the main video was playing while flipping the slider, video playback stops, progress bar shifts to the beginning, "Play" icons on the control panel and in the center of the video change to the original ones
- even with frequent clicks or swipes, there is no situation when a slide is off-center after flipping, no situation when two slides are visible at the same time.

#### 4. Section Video (custom video player)
- clicking on the "Play" button at the bottom left of the video panel, the video starts playing, the button icon changes to "Pause", the large "Play" button in the center of the video disappears. Clicking the button again stops video playback, the icon changes to the original one, the large “Play” button in the center of the video is displayed again
- clicking on the large "Play" button in the center of the video, or when you click on the video itself, the video starts playing, the "Play" button icon at the bottom left of the video panel changes to "Pause", the large "Play" button in the center of the video disappears. Clicking on a video that is playing stops the video playing, the "Play" button icon at the bottom left of the video panel changes to the original one, the large "Play" button in the center of the video is displayed again
- progress bar displays video playback progress
- dragging the progress bar slider allows you to change the time from which the video is played
- if you drag the progress bar to the end, the video stops, and accordingly, the appearance of the "Play" buttons changes
- when you click on the speaker icon, you toggle the sound and the icon itself (the sound is turned on or off, the icon changes accordingly)
- moving the audio volume slider changes the video volume
- if you drag the sound volume slider to 0, the sound is turned off, the speaker icon becomes crossed out
- if you drag the sound volume slider from 0 when the speaker is off, the sound turns on, the volume icon is no longer crossed out
- clicking the fullscreen button, the video goes into full-screen mode, with the video and control panel expanding to full screen and clicking the fullscreen button again, the video exits full-screen mode
- the control panel in full-screen mode visually looks the same as in the layout - the buttons are evenly distributed across the entire width of the page, the relative sizes between buttons and sliders, as well as the relative sizes of the buttons themselves, remain the same
- control the player from the keyboard:
    - changing the playback speed, a number with the current playback rate appears and disappears on top of the video, as happens in YouTube videos
    - space key - pause, when pressed again - play
    - key M - mute/unmute sound
    - key F - enable/disable full screen mode
    - SHIFT+ keys - speed up video playback
    - SHIFT+ keys - slow down video playback

#### 5. Section Gallery
- when scrolling down the page, the appearance of pictures in the Galery section is accompanied by animation: the images smoothly rise from the bottom to the top, enlarging and creating a pop-up effect
- if you scroll up the page and then scroll down again, the animation of the appearance of the pictures is repeated
- when the page is refreshed, if the page has been scrolled to the Galery section, the animation of the paintings is repeated and the pictures are displayed in random order

#### 6. Ticket Section and Booking ticket form
- when clicking the **Buy Now** button opens a form *Booking ticket form* and it already contains the data specified on the website page - number of tickets, their type, total price for them
- using the **"Mediator "** design pattern, data changes on the site in the *Ticket Section* are displayed in the *Booking ticket form* and vice versa, respectively
- if you change the number of *Basic* and *Senior* tickets, the total price for them will be recalculated
- each type of ticket has its own price (the information is stored in the *pricelist.json* file). If you change the ticket type, the total price for them is recalculated
- `TODO` when the page is refreshed, the previously selected number of Basic and Senior tickets, the selected ticket type and the total price for them are saved
- it is possible to change the **type of ticket** as well as change the **number of tickets** of each type in the *Ticket type field* of the *Booking ticket form* on the left, thus changing the ticket type, the number of tickets, ticket price and total ticket price on the right
- when a user selects a date and / or time in the form on the left, it is displayed in the ticket on the right
- it is impossible to select a date in the past
- time can be selected from 9:00 to 18:00 with an interval of 30 minutes

#### 7. Form validation
- `TODO` validation of the user name: the username must contain from 3 to 15 characters, as characters can be used letters in lower or upper case and spaces.
- `TODO` e-mail validation should pass only addresses of the following type: username@example.com, where: username - username, must contain from 3 to 15 characters (letters, digits, underscore, hyphen), must not contain spaces; @ - doggie symbol; example - first-level domain consists of at least 4 Latin letters; com - top-level domain, separated from the first-level domain by a dot and consists of at least 2 Latin letters.
- `TODO` phone number validation: the number contains only digits; without separation or with separation into two or three digits; separation of digits can be through hyphen or space; with limitation on the number of digits not more than 10 digits
- `TODO` when attempting to enter invalid value into input, its border is highlighted in red and a text warning in human-readable format is displayed

#### 8. Parallax

#### 9. Section Visiting. Google Street View
`TODO`

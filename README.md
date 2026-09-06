# Ashika Birthday Scrapbook

A static birthday surprise made with HTML, CSS, and vanilla JavaScript.

## Add your media

- Photos: replace the placeholder files in `assets/photos/` with Ashika's photos, or update the four `src` values in `index.html` to your `.jpg` files. The current `.svg` files keep the gallery and video poster free of broken-image errors before you add real photos.
- Video: replace `assets/videos/birthday-video.mp4` with your 2-minute video. The supplied `video-1.mp4` has already been copied there as the current video asset.
- Music: add your song as `assets/music/birthday-song.mp3`.

## Edit the gift

Most visible text is directly in `index.html`. The editable memory prompts are in the `memories` array in `script.js`, and secret-letter messages are the `data-message` values on the `.tiny-envelope` buttons in `index.html`.

## Run in VS Code

Open the folder in VS Code, then either:

1. Open `index.html` with Live Server, if installed.
2. Or run `npx --yes serve .` in the integrated terminal and open the local URL it prints.
3. Or double-click `index.html` for the basic experience. The microphone feature works best from `localhost` or HTTPS.

## Test candle blowing

Scroll to **Make a wish, Ashika**, select **Enable candle blowing**, allow microphone permission, and blow gently toward the microphone. If permission is blocked or unavailable, tap any candle; the same celebration will trigger.

const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");
const { extractColorsFromSrc } = require("extract-colors");

function makeCard(options = {}) {
   const { trackName, trackAuthor, album } = options;

    const thumbnail = await loadImage(album.image);

    const canvas = createCanvas(1000, 300);
    const ctx = canvas.getContext("2d");

    let logo = await loadImage(
      join(__dirname, "..", "Assets", "Images", "spotify.png")
    );
  
    //find a spotify logo lol

    roundedImage(ctx, 0, 0, canvas.width, canvas.height, 55);
    ctx.clip();

    const palette = await getPalette(album.image);

    let color = Color(palette[0].hex);

    if (palette.length === 1) {
      color.isDark()
        ? palette.push({ hex: "#ffffff", red: 255, green: 255, blue: 255 })
        : palette.push({ hex: "#000000", red: 0, green: 0, blue: 0 });
    }

    const firstColor = palette[0].hex;
    const secondColor = palette[1].hex;

    ctx.fillStyle = secondColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.fillStyle = firstColor;
    ctx.font = "bold 55px Arial";

    let x = 50;
    let y = 70 + 10;

    let w = 140;
    let h = 140;

    ctx.save();
    roundedImage(ctx, x, y, w, h, 50);
    ctx.clip();
    ctx.drawImage(thumbnail, x, y, w, h);
    ctx.restore();

    ctx.fillStyle = firstColor;
    ctx.font = "bold 40px Arial";
    ctx.fillText(trackName, 210, 130);

    ctx.font = "25px Arial";
    ctx.fillText(trackAuthor, 210, 170);

    logo = await recolor(logo, firstColor);

    ctx.drawImage(logo, 50, 15, 45, 45);
    ctx.fillText(`Spotify • ${album.name}`, 110, 45);

    return canvas.toBuffer();  
} 

function getPalette(src) {
    const data = await extractColorsFromSrc(src);

    for (const x of data) {
      (x.red * 299 + x.green * 587 + x.blue * 114) / 1000 < 128
        ? Object.assign(x, { textStyle: "#ffffff" })
        : Object.assign(x, { textStyle: "#000000" });
    }

    return data.sort((a, b) => b.area - a.area);
}

function roundedImage(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    return ctx;
}

function recolor(image, hex) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return await loadImage(canvas.toBuffer());
}

//usage
(async () => {
const buffer = await makeCard({
trackName: "sus",
trackAuthor: "sussy",
album: {
name: "amogus",
image: "https://i.ytimg.com/vi/TdktSS0lQ1Q/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA6dLXDCD9ofSWrcvzZjS7nuHfoYg"
}
})

//handle the buffer
})()

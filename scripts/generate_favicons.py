import os
from PIL import Image, ImageDraw


def create_shield_icon(size: int) -> Image.Image:
    # High-resolution canvas for downsampling
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # Dark slate background (#0F172A)
    draw = ImageDraw.Draw(img)

    # Scale coordinates
    margin = size * 0.15
    w = size - 2 * margin
    h = size - 2 * margin
    center_x = size / 2

    # Shield polygon coordinates
    shield_pts = [
        (center_x, margin),
        (size - margin, margin + h * 0.25),
        (size - margin, margin + h * 0.65),
        (center_x, size - margin),
        (margin, margin + h * 0.65),
        (margin, margin + h * 0.25),
    ]

    # Draw Shield Outline in Industrial Steel Blue (#0284C7)
    stroke_width = max(2, int(size * 0.06))
    draw.polygon(shield_pts, outline=(2, 132, 199, 255), width=stroke_width)

    # Draw Barrier Beam in Cyan (#38BDF8)
    beam_y = int(size * 0.52)
    beam_x1 = int(size * 0.32)
    beam_x2 = int(size * 0.68)
    draw.line([(beam_x1, beam_y), (beam_x2, beam_y)], fill=(56, 189, 248, 255), width=stroke_width)

    # Center Barrier Node
    node_r = max(2, int(size * 0.07))
    draw.ellipse(
        [(center_x - node_r, beam_y - node_r), (center_x + node_r, beam_y + node_r)],
        fill=(56, 189, 248, 255)
    )

    return img


def generate_all_icons():
    pub_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/web/public"))
    os.makedirs(pub_dir, exist_ok=True)

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
    }

    images = {}
    for filename, s in sizes.items():
        icon = create_shield_icon(s)
        path = os.path.join(pub_dir, filename)
        icon.save(path, "PNG")
        images[s] = icon
        print(f"Generated {filename} ({s}x{s})")

    # Generate multi-size favicon.ico
    ico_path = os.path.join(pub_dir, "favicon.ico")
    images[32].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"Generated favicon.ico (16, 32, 48)")


if __name__ == "__main__":
    generate_all_icons()

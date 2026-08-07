import math
import re
from pathlib import Path

THEMES_DIR = Path(__file__).resolve().parent.parent / "src" / "lib" / "styles" / "themes"


def srgb_gamma(x: float) -> float:
    if x <= 0.0031308:
        return 12.92 * x
    return 1.055 * (x ** (1 / 2.4)) - 0.055


def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def oklch_to_hex(l: float, c: float, h: float) -> str:
    # OKLCH -> OKLab
    h_rad = math.radians(h)
    a = c * math.cos(h_rad)
    b = c * math.sin(h_rad)

    # OKLab -> LMS (nonlinear)
    l_ = l + 0.3963377774 * a + 0.2158037573 * b
    m_ = l - 0.1055613458 * a - 0.0638541728 * b
    s_ = l - 0.0894841775 * a - 1.2914855480 * b

    l3 = l_ ** 3
    m3 = m_ ** 3
    s3 = s_ ** 3

    # LMS -> linear sRGB
    r_lin = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
    g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
    b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3

    r = round(clamp01(srgb_gamma(clamp01(r_lin))) * 255)
    g = round(clamp01(srgb_gamma(clamp01(g_lin))) * 255)
    b_ = round(clamp01(srgb_gamma(clamp01(b_lin))) * 255)
    return f"{r:02X}{g:02X}{b_:02X}"


def expand_hex(hex_digits: str) -> tuple[str, str]:
    """Return (alpha, rrggbb) uppercase from a hex string without '#'."""
    h = hex_digits
    if len(h) == 3:  # RGB
        r, g, b = h[0] * 2, h[1] * 2, h[2] * 2
        return "FF", (r + g + b).upper()
    if len(h) == 4:  # RGBA
        r, g, b, a = h[0] * 2, h[1] * 2, h[2] * 2, h[3] * 2
        return a.upper(), (r + g + b).upper()
    if len(h) == 6:  # RRGGBB
        return "FF", h.upper()
    if len(h) == 8:  # RRGGBBAA
        return h[6:8].upper(), h[0:6].upper()
    raise ValueError(f"Unexpected hex length: {hex_digits}")


HEX_RE = re.compile(r"#([0-9a-fA-F]{3,8})\b")
OKLCH_RE = re.compile(r"oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)")


def flutter_color(line: str) -> str | None:
    hex_match = HEX_RE.search(line)
    if hex_match:
        alpha, rrggbb = expand_hex(hex_match.group(1))
        return f"Color(0x{alpha}{rrggbb})"

    oklch_match = OKLCH_RE.search(line)
    if oklch_match:
        l, c, h = (float(x) for x in oklch_match.groups())
        return f"Color(0xFF{oklch_to_hex(l, c, h)})"

    return None


def process(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    changed = 0
    out = []
    for line in lines:
        if "/* Color(0x" in line:
            out.append(line)
            continue
        color = flutter_color(line)
        if color is None:
            out.append(line)
            continue
        stripped = line.rstrip()
        out.append(f"{stripped} /* {color} */")
        changed += 1
    if changed:
        path.write_text("\n".join(out), encoding="utf-8")
    return changed


def main() -> None:
    total = 0
    for css in sorted(THEMES_DIR.rglob("*.css")):
        n = process(css)
        total += n
        print(f"{css.relative_to(THEMES_DIR)}: {n} colors annotated")
    print(f"Total: {total}")


if __name__ == "__main__":
    main()

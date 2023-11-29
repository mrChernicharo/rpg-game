different enemy attacks
hero magic
item effects
defense effect
statuses (poison, slow, )

=============

Party {
heroes: Character[],
formation: { [charId]: Position }
}

ALL_HEROES VS Party.heroes
small-hero-selection-list
equip the goddamn heroes

# ffmpeg

### Flip image

```bash
ffmpeg \
    -i ./in.png \
    -filter:v "hflip, vflip" \
    -c:a copy \
    ./out.webp
```

### Flip horizontaly only

```bash
ffmpeg -i ./in.png -filter:v "hflip" -c:a copy ./out.webp
```

# Resize/scale image

```bash
ffmpeg -i input.jpg -vf scale=320:240 output_320x240.png
```

The scale filter can also automatically calculate a dimension while preserving the aspect ratio:

```bash
ffmpeg -i in.jpg -vf scale=320:-1 out.png

ffmpeg -i in.jpg -vf scale=-1:240 out.png
```

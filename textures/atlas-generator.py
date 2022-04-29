from PIL import Image

textureSize = 64

atlasWidth = 10
atlasHeight = 4

textArray = [
    [
        "ball1-blue",
        "ball1-green",
        "ball1-red"
    ],
    [
        "ball2-blue",
        "ball2-green",
        "ball2-red"
    ],
    [
        "paint-blue",
        "paint-green",
        "paint-red"
    ],
    [
        "player-green",
        "player-yellow",
        "wall1",
        "wall2"
    ],

]


atlas_image = Image.new('RGBA', (atlasWidth*textureSize, atlasHeight*textureSize))
for x in range (len(textArray)):
    column = textArray[x]
    for y in range (len(column)):
        name = column[y]
        image = Image.open(F"textures/{name}.png")
        atlas_image.paste(image, (x*textureSize, y*textureSize))
        
atlas_image.save("textures/_atlas.png","PNG")
atlas_image.show()
# new_image.paste(image1, (0, 0))
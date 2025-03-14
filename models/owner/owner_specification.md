# Female Owner Model Specification

## Overview
This document outlines the specifications for creating a realistic 3D model of a woman (the French Bulldog's owner).

## Character Description
- Adult woman (30-40 years old)
- Average/Realistic body proportions
- Neutral, friendly facial features
- Average height: 5'5" to 5'7" (165-170 cm)
- Casual, comfortable clothing appropriate for dog walking/playing

## Model Components

### Base Mesh (`base/woman_base.obj`)
- Topology: Clean, quad-based topology
- Resolution: Medium-poly base (~20,000-30,000 polygons)
- Anatomically accurate proportions
- UV mapping: Properly unwrapped with no overlaps
- Rig-ready with proper edge loops for deformation
- T-pose or A-pose for base model

### Head (`components/woman_head.obj`)
- Separate high-poly mesh for detailed sculpting (~25,000-40,000 polygons)
- Realistic facial features with natural asymmetry
- Detailed ears
- Proper eye sockets, nose, and mouth areas
- Smooth neck-to-head transition

### Body Parts
- **Face** (`components/woman_face.obj`): Detailed facial features
- **Eyes** (`components/woman_eyes.obj`): Detailed eyes with cornea, iris, and tear ducts
- **Mouth** (`components/woman_mouth.obj`): Detailed mouth interior, tongue, and teeth
- **Hands** (`components/woman_hands.obj`): Detailed hands with proper finger topology
- **Feet** (`components/woman_feet.obj`): Detailed feet for barefoot or with shoes

### Hair System
- **Base Hair** (`components/woman_hair_base.obj`): Base hair mesh or cap
- **Hair Cards/Strands** (`components/woman_hair_strands.obj`): Depending on technique
- **Hair Texture Maps** (`textures/woman_hair_*.png`): For color, alpha, and flow control
- Realistic hair styling suitable for casual outdoor activities

### Clothing
- **Top** (`components/woman_top.obj`): Casual shirt or blouse
- **Bottom** (`components/woman_bottom.obj`): Jeans, pants, or shorts
- **Footwear** (`components/woman_shoes.obj`): Casual shoes or sneakers
- **Accessories** (`components/woman_accessories.obj`): Optional accessories like watch, necklace, etc.
- Proper cloth simulation-ready topology

## Materials and Textures

### Skin
- **Diffuse Map** (`textures/woman_skin_color.png`): 4K resolution color map with subtle variations
- **Specular Map** (`textures/woman_skin_specular.png`): For controlling shininess
- **Normal Map** (`textures/woman_skin_normal.png`): For fine details and pores
- **Displacement Map** (`textures/woman_skin_displacement.exr`): For medium-scale details
- **Subsurface Scattering Map** (`textures/woman_skin_sss.png`): For realistic skin translucency

### Eyes
- **Eye Color** (`textures/woman_eye_color.png`): Detailed iris texture
- **Eye Normal** (`textures/woman_eye_normal.png`): For cornea detail
- **Eye Specular** (`textures/woman_eye_specular.png`): For realistic highlights
- **Sclera Map** (`textures/woman_eye_sclera.png`): For subtle veins and variation

### Mouth
- **Lips Diffuse** (`textures/woman_lips_color.png`)
- **Lips Normal** (`textures/woman_lips_normal.png`)
- **Tongue/Gums Diffuse** (`textures/woman_mouth_color.png`)
- **Teeth Diffuse** (`textures/woman_teeth_color.png`)
- **Teeth Normal** (`textures/woman_teeth_normal.png`)

### Hair
- **Hair Diffuse** (`textures/woman_hair_color.png`)
- **Hair Alpha** (`textures/woman_hair_alpha.png`): For card-based hair
- **Hair Normal** (`textures/woman_hair_normal.png`)
- **Hair Specular** (`textures/woman_hair_specular.png`)

### Clothing
- **Clothing Diffuse** (`textures/woman_clothing_color.png`)
- **Clothing Normal** (`textures/woman_clothing_normal.png`)
- **Clothing Specular** (`textures/woman_clothing_specular.png`)
- **Clothing Roughness** (`textures/woman_clothing_roughness.png`)

## Rigging Requirements
- Clean, animation-ready skeleton with proper joint hierarchy
- IK handles for arms and legs
- Facial rigging system with:
  - Mouth expressions (smile, frown, etc.)
  - Eye movement and blinks
  - Eyebrow control
  - Various facial expressions (happy, concerned, neutral)
- Hand controls for finger posing
- Weight painting for smooth deformation
- Optional cloth simulation setup

## Level of Detail Variations
- **High-poly** (`base/woman_high.obj`): ~150,000-250,000 polygons for close-up rendering
- **Mid-poly** (`base/woman_mid.obj`): ~30,000-50,000 polygons for general use
- **Low-poly** (`base/woman_low.obj`): ~8,000-15,000 polygons for background or real-time applications

## Reference Materials
- See `reference/` directory for reference photos
- Key reference angles:
  - Front view
  - Side view
  - Three-quarter view
  - Back view
  - Close-ups of face, hands, and clothing details

## Export Formats
- Source files in native format
- OBJ with material settings
- FBX with rigging
- glTF for web/real-time use
- Separate LOD models 
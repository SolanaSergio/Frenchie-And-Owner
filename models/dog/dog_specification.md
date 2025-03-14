# French Bulldog Model Specification

## Overview
This document outlines the specifications for creating a realistic 3D model of a French Bulldog.

## Breed Characteristics
- Short, smooth coat
- Compact, muscular body
- Distinctive "bat ears"
- Flat, short muzzle with slight underbite
- Wrinkled face and forehead
- Broad chest and shoulders
- Short tail (either straight or screwed)
- Average height: 11-12 inches
- Average weight: 16-28 pounds
- Coloration: Various (brindle, fawn, pied, cream, etc.)

## Model Components

### Base Mesh (`base/frenchie_base.obj`)
- Topology: Quad-based clean topology
- Resolution: Medium-poly base (~15,000-25,000 polygons)
- Proportions: Accurate to breed standard
- UV mapping: Properly unwrapped with no overlaps
- Rig-ready with proper edge loops for deformation
- Neutral pose standing on all fours

### Head (`components/frenchie_head.obj`)
- Separate high-poly mesh for detailed sculpting (~20,000-30,000 polygons)
- Detailed facial wrinkles and folds
- Accurate bat ear shape and size
- Proper jowls and cheeks
- Flat face with slight underbite
- Proper nostril placement and size

### Body Parts
- **Ears** (`components/frenchie_ears.obj`): Detailed bat ears with inner ear detail
- **Eyes** (`components/frenchie_eyes.obj`): Realistic eye geometry with cornea, iris, and pupil
- **Mouth** (`components/frenchie_mouth.obj`): Detailed mouth interior, tongue, and teeth
- **Nose** (`components/frenchie_nose.obj`): Detailed nostrils and nose leather
- **Paws** (`components/frenchie_paws.obj`): Detailed paw pads and nails
- **Tail** (`components/frenchie_tail.obj`): Short tail with proper shape (straight or screwed)

### Fur System
- Short fur representation using either:
  - Displacement/normal maps for the base coat
  - Hair particles for added realism (sparse, short hairs)
- Direction maps for proper hair flow

## Materials and Textures

### Skin/Fur
- **Diffuse Map** (`textures/frenchie_color.png`): 4K resolution color map
- **Specular Map** (`textures/frenchie_specular.png`): For controlling shininess
- **Normal Map** (`textures/frenchie_normal.png`): For fine wrinkle details
- **Displacement Map** (`textures/frenchie_displacement.exr`): For larger wrinkles and skin folds
- **Subsurface Scattering Map** (`textures/frenchie_sss.png`): For ear translucency and thin skin areas

### Eyes
- **Eye Color** (`textures/frenchie_eye_color.png`): Detailed iris texture
- **Eye Normal** (`textures/frenchie_eye_normal.png`): For cornea detail
- **Eye Specular** (`textures/frenchie_eye_specular.png`): For realistic highlights

### Mouth
- **Tongue/Gums Diffuse** (`textures/frenchie_mouth_color.png`)
- **Tongue/Gums Specular** (`textures/frenchie_mouth_specular.png`)
- **Teeth Diffuse** (`textures/frenchie_teeth_color.png`)
- **Teeth Normal** (`textures/frenchie_teeth_normal.png`)

### Nose and Paw Pads
- **Nose Diffuse** (`textures/frenchie_nose_color.png`)
- **Nose Normal** (`textures/frenchie_nose_normal.png`)
- **Paw Pad Diffuse** (`textures/frenchie_paw_color.png`)
- **Paw Pad Normal** (`textures/frenchie_paw_normal.png`)

## Rigging Requirements
- Clean, animation-ready skeleton
- IK handles for legs
- Facial blend shapes/morphs for:
  - Mouth open/close
  - Panting
  - Ear movement
  - Eye blinks
  - Various expressions (happy, alert, tired)

## Level of Detail Variations
- **High-poly** (`base/frenchie_high.obj`): ~100,000-150,000 polygons for close-up rendering
- **Mid-poly** (`base/frenchie_mid.obj`): ~25,000-40,000 polygons for general use
- **Low-poly** (`base/frenchie_low.obj`): ~5,000-10,000 polygons for background or real-time applications

## Reference Materials
- See `reference/` directory for breed standard photos
- Key reference angles:
  - Front view
  - Side view
  - Three-quarter view
  - Top view
  - Close-ups of face, paws, and tail

## Export Formats
- Source files in native format
- OBJ with material settings
- FBX with rigging
- glTF for web/real-time use
- Separate LOD models 
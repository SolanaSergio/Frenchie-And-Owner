# Scene Specification for French Bulldog and Owner

## Overview
This document outlines the specifications for creating scenes that feature both the French Bulldog and its owner together in various poses and environments.

## Scene Types

### Casual Home Setting
- **File**: `home_scene.blend/ma/max`
- **Description**: Owner sitting on couch or floor with dog
- **Lighting**: Warm interior lighting with window light
- **Props**: Couch, rug, coffee table, dog toys
- **Camera Angles**: 
  - Wide shot showing both characters
  - Close-up on interaction
  - Dog's perspective looking up at owner

### Park/Outdoor Setting
- **File**: `park_scene.blend/ma/max`
- **Description**: Owner walking or playing with dog in park
- **Lighting**: Natural daylight, slight rim lighting
- **Props**: Trees, path, grass, leash, ball or frisbee
- **Camera Angles**:
  - Wide establishing shot
  - Medium shot of walking together
  - Action shots of play

### Portrait Setting
- **File**: `portrait_scene.blend/ma/max`
- **Description**: Formal portrait-style setup of owner holding dog
- **Lighting**: Studio 3-point lighting setup
- **Props**: Minimal, possibly a stool or bench
- **Camera Angles**:
  - Front-facing portrait
  - Three-quarter view
  - Profile view

## Pose Libraries

### Dog Poses
- **Standing** (`poses/dog_standing.pose`)
- **Sitting** (`poses/dog_sitting.pose`)
- **Lying down** (`poses/dog_lying.pose`)
- **Playing** (`poses/dog_playing.pose`)
- **Alert/attentive** (`poses/dog_alert.pose`)
- **Sleeping** (`poses/dog_sleeping.pose`)

### Owner Poses
- **Standing** (`poses/owner_standing.pose`)
- **Sitting** (`poses/owner_sitting.pose`)
- **Kneeling** (`poses/owner_kneeling.pose`)
- **Walking** (`poses/owner_walking.pose`)
- **Playing with dog** (`poses/owner_playing.pose`)
- **Holding dog** (`poses/owner_holding.pose`)

## Interaction Poses
- **Owner petting dog** (`poses/interaction_petting.pose`)
- **Owner feeding dog** (`poses/interaction_feeding.pose`)
- **Walking together** (`poses/interaction_walking.pose`)
- **Playing fetch** (`poses/interaction_fetch.pose`)
- **Cuddling** (`poses/interaction_cuddling.pose`)

## Lighting Setups

### Indoor Lighting
- **Warm Home** (`lighting/warm_home.light`): Warm, soft lighting for cozy indoor scenes
- **Cool Evening** (`lighting/cool_evening.light`): Cooler blue tones for evening scenes
- **Dramatic** (`lighting/dramatic_indoor.light`): High contrast for more dramatic portraits

### Outdoor Lighting
- **Sunny Day** (`lighting/sunny_day.light`): Bright sunlight with appropriate shadows
- **Overcast** (`lighting/overcast.light`): Soft, diffused lighting without harsh shadows
- **Golden Hour** (`lighting/golden_hour.light`): Warm sunset/sunrise lighting
- **Blue Hour** (`lighting/blue_hour.light`): Post-sunset cool blue lighting

## Camera Presets
- **Wide Establishing** (`cameras/wide.cam`): Shows full environment and both characters
- **Medium Two-Shot** (`cameras/medium.cam`): Frames both characters from mid-distance
- **Close-Up Interaction** (`cameras/closeup.cam`): Focuses on specific interaction points
- **Portrait** (`cameras/portrait.cam`): Formal portrait framing
- **Dog POV** (`cameras/dog_pov.cam`): Camera at dog's eye level

## Render Settings

### Preview Renders
- Resolution: 1920x1080
- Samples: 128-256
- Denoising: Enabled
- Output format: PNG/JPG

### Final Renders
- Resolution: 4K (3840x2160) or higher
- Samples: 1024-2048
- Denoising: Enabled
- Output format: EXR (multi-layer) and PNG/JPG
- Optional passes:
  - Depth
  - Normal
  - Object ID
  - Material ID
  - Shadow
  - Ambient Occlusion

## Post-Processing
- Color grading presets for different moods
- Vignette options
- Depth of field settings
- Optional film grain

## Export Formats
- Source scene files in native format
- Alembic caches for animation
- FBX for cross-application compatibility
- USD for modern pipelines 
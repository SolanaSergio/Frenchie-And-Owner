# Naming Conventions

This document outlines the naming conventions for all files related to the French Bulldog and Owner 3D modeling project.

## General Principles

- Use lowercase for all filenames
- Use underscores (_) to separate words
- Avoid spaces in filenames
- Use descriptive names that indicate content
- Include version numbers where appropriate
- Use consistent prefixes and suffixes
- Keep filenames reasonably short while maintaining clarity
- Use standard file extensions appropriate to file type

## Model Files

### Base Format
`[character]_[component]_[descriptor]_[version].[extension]`

### Examples
- `dog_body_base_v01.blend`
- `dog_head_highpoly_v02.blend`
- `dog_paws_retopo_v01.blend`
- `owner_body_base_v01.blend`
- `owner_head_sculpt_v03.blend`
- `owner_hands_retopo_v02.blend`

### Component Categories
- body
- head
- legs
- paws/hands
- tail
- ears
- eyes
- teeth
- tongue
- clothing
- accessories

### Descriptor Categories
- base (low-poly base mesh)
- highpoly (high-resolution sculpt)
- retopo (retopologized mesh)
- lod0, lod1, lod2 (levels of detail)
- collision (collision mesh)
- cage (cage mesh for baking)
- proxy (proxy mesh for animation)

## Texture Files

### Base Format
`[character]_[component]_[map-type]_[resolution]_[version].[extension]`

### Examples
- `dog_body_color_4k_v01.png`
- `dog_head_normal_2k_v02.png`
- `dog_eyes_roughness_1k_v01.png`
- `owner_body_color_4k_v01.png`
- `owner_face_sss_2k_v02.png`
- `owner_clothing_normal_4k_v01.png`

### Map Type Categories
- color (base color/albedo)
- normal (normal map)
- height (height/displacement map)
- roughness (roughness/glossiness map)
- metallic (metallic map)
- ao (ambient occlusion map)
- opacity (opacity/transparency map)
- emission (emission/glow map)
- sss (subsurface scattering map)
- thickness (thickness map)
- mask (mask map for various effects)
- fur (fur direction/length map)
- detail (detail map for micro surface)
- dirt (dirt/wear map)
- specular (specular map)

### Resolution Categories
- 8k (8192x8192)
- 4k (4096x4096)
- 2k (2048x2048)
- 1k (1024x1024)
- 512 (512x512)
- 256 (256x256)

## Scene Files

### Base Format
`[scene-type]_[descriptor]_[version].[extension]`

### Examples
- `scene_park_main_v01.blend`
- `scene_park_lighting_test_v02.blend`
- `scene_studio_portrait_v01.blend`
- `scene_interaction_walking_v01.blend`

### Scene Type Categories
- scene (complete scene)
- environment (environment only)
- lighting (lighting setup)
- composition (camera and composition)
- test (test scene for specific purpose)

## Animation Files

### Base Format
`[character]_[animation-type]_[descriptor]_[version].[extension]`

### Examples
- `dog_walk_cycle_v01.blend`
- `dog_run_fast_v02.blend`
- `dog_idle_panting_v01.blend`
- `owner_walk_casual_v01.blend`
- `interaction_petting_sitting_v02.blend`

### Animation Type Categories
- walk (walking animation)
- run (running animation)
- idle (idle animation)
- pose (static pose)
- expression (facial expression)
- interaction (interaction between characters)
- cycle (looping animation)

## Reference Files

### Base Format
`ref_[category]_[subject]_[descriptor].[extension]`

### Examples
- `ref_dog_breed_side.jpg`
- `ref_dog_head_wrinkles.jpg`
- `ref_owner_body_proportions.jpg`
- `ref_environment_park_lighting.jpg`

### Reference Categories
- dog (French Bulldog references)
- owner (Owner character references)
- environment (Environment references)
- material (Material references)
- lighting (Lighting references)
- pose (Pose references)
- anatomy (Anatomical references)

## Script Files

### Base Format
`[script-type]_[function]_[version].[extension]`

### Examples
- `tool_uv_unwrap_v01.py`
- `tool_fur_generator_v02.js`
- `utility_file_renamer_v01.py`
- `shader_skin_sss_v01.glsl`

### Script Type Categories
- tool (tools for specific tasks)
- utility (utility scripts)
- shader (shader scripts)
- setup (setup scripts)
- export (export scripts)
- import (import scripts)

## Documentation Files

### Base Format
`doc_[category]_[subject].[extension]`

### Examples
- `doc_model_specifications.md`
- `doc_texture_guidelines.md`
- `doc_animation_requirements.md`
- `doc_project_overview.pdf`

### Documentation Categories
- model (model documentation)
- texture (texture documentation)
- animation (animation documentation)
- rig (rigging documentation)
- project (project overview)
- technical (technical specifications)
- workflow (workflow guidelines)
- reference (reference guidelines)

## Export Files

### Base Format
`[character/scene]_[component]_[format-descriptor]_[version].[extension]`

### Examples
- `dog_complete_fbx_v01.fbx`
- `dog_head_obj_v02.obj`
- `owner_complete_gltf_v01.gltf`
- `scene_park_fbx_v01.fbx`

### Format Descriptor Categories
- fbx (FBX format)
- obj (OBJ format)
- gltf (glTF format)
- abc (Alembic format)
- usd (USD format)

## Material Library Files

### Base Format
`mat_[category]_[material-name]_[version].[extension]`

### Examples
- `mat_dog_skin_fawn_v01.blend`
- `mat_dog_eyes_brown_v01.blend`
- `mat_owner_skin_medium_v02.blend`
- `mat_environment_grass_v01.blend`

### Material Categories
- dog_skin (dog skin materials)
- dog_fur (dog fur materials)
- dog_eyes (dog eye materials)
- owner_skin (owner skin materials)
- owner_hair (owner hair materials)
- owner_clothing (owner clothing materials)
- environment (environment materials)

## Render Output Files

### Base Format
`render_[scene]_[view]_[resolution]_[version].[extension]`

### Examples
- `render_park_front_4k_v01.png`
- `render_portrait_closeup_2k_v02.jpg`
- `render_interaction_walking_4k_v01.png`
- `render_turntable_dog_1080p_v01.mp4`

### View Categories
- front (front view)
- side (side view)
- back (back view)
- 34 (3/4 view)
- top (top view)
- closeup (close-up view)
- wide (wide view)
- turntable (360° turntable)

## Version Control

### Version Numbering
- Use two-digit version numbers: v01, v02, v03, etc.
- Major revisions can use v10, v20, etc.
- Work-in-progress files can use "wip" suffix: `dog_body_base_wip.blend`

### Date-based Versioning
For rapidly changing files, date-based versioning can be used:
- `dog_body_base_20230615.blend` (YYYYMMDD format)
- `dog_body_base_20230615_1430.blend` (YYYYMMDD_HHMM format)

## Folder Structure

### Main Project Structure
```
/french_bulldog_project
  /models
    /dog
      /base
      /highpoly
      /retopo
      /lod
    /owner
      /base
      /highpoly
      /retopo
      /lod
  /textures
    /dog
      /color
      /normal
      /roughness
      /etc
    /owner
      /color
      /normal
      /roughness
      /etc
    /environment
  /scenes
    /park
    /studio
    /tests
  /animations
    /dog
    /owner
    /interactions
  /references
    /dog
    /owner
    /environment
    /materials
  /scripts
    /tools
    /utilities
    /shaders
  /documentation
  /exports
    /fbx
    /obj
    /gltf
  /renders
    /final
    /wip
    /tests
  /materials
    /dog
    /owner
    /environment
```

## Implementation Notes

### File Naming Implementation
- All project files have been renamed according to these conventions
- Automated scripts have been created to assist with consistent naming
- File naming validation is performed during quality control checks

### Folder Structure Implementation
- The complete folder structure has been created
- All existing files have been organized according to this structure
- Backup of the original file organization has been maintained

## Additional Naming Conventions

### Texture Set Naming
For complex models with multiple texture sets:
- `dog_body_a_color_4k_v01.png` (Set A)
- `dog_body_b_color_4k_v01.png` (Set B)

### LOD Naming
For models with multiple levels of detail:
- `dog_complete_lod0_v01.blend` (Highest detail)
- `dog_complete_lod1_v01.blend` (Medium detail)
- `dog_complete_lod2_v01.blend` (Low detail)

### Variation Naming
For models or textures with variations:
- `dog_fur_fawn_v01.blend` (Fawn color variation)
- `dog_fur_brindle_v01.blend` (Brindle color variation)
- `dog_fur_pied_v01.blend` (Pied color variation)

## Recent Naming Convention Updates

The following updates have been made to the naming conventions to better support the project's current state:

### Enhanced Material Naming
- Added support for PBR workflow with specific shader types
- `mat_dog_skin_pbr_standard_v01.blend`
- `mat_dog_fur_pbr_anisotropic_v01.blend`
- `mat_owner_hair_pbr_hair_v01.blend`

### Animation Sequence Naming
- Added frame range indicators for animation sequences
- `dog_walk_cycle_f001-f030_v01.blend`
- `interaction_petting_f001-f120_v01.blend`

### Environment Element Naming
- Added specific naming for park scene elements
- `env_tree_oak_v01.blend`
- `env_bench_wooden_v01.blend`
- `env_path_stone_v01.blend`

### Render Pass Naming
- Added naming for specific render passes and compositing elements
- `render_park_beauty_4k_v01.exr`
- `render_park_ao_4k_v01.exr`
- `render_park_depth_4k_v01.exr`

### Web Deployment Naming
- Added naming conventions for web-optimized assets
- `web_dog_complete_draco_v01.glb` (Draco compressed glTF binary)
- `web_texture_dog_color_1k_jpg_v01.jpg` (Web-optimized texture)
- `web_scene_park_optimized_v01.glb` (Web-optimized scene)

These naming conventions ensure consistency across all project files and facilitate efficient file management, version control, and collaboration. 
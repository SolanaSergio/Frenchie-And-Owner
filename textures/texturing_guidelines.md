# Texturing Guidelines for French Bulldog and Owner Models

## Overview
This document outlines the standards and workflow for creating textures for both the French Bulldog and owner models.

## Texture Resolution Standards

### Base Resolution Chart
| Asset Type | Preview | Production | Hero Close-up |
|------------|---------|------------|--------------|
| Dog Base Body | 2K | 4K | 8K |
| Dog Face/Head | 2K | 4K | 8K |
| Dog Components | 1K | 2K | 4K |
| Owner Body | 2K | 4K | 8K |
| Owner Face | 2K | 4K | 8K |
| Owner Hands | 1K | 2K | 4K |
| Clothing | 2K | 4K | 6K |
| Hair | 2K | 4K | 6K |
| Props | 1K | 2K | 4K |

## Texture Maps Required

### PBR Material Standard Maps
- **Base Color/Diffuse**: RGB color information
- **Normal**: Surface detail for bumps and wrinkles
- **Roughness**: Surface smoothness/roughness
- **Metallic**: For any metallic elements (accessories, etc.)
- **Height/Displacement**: For major surface displacement
- **Ambient Occlusion**: For crevices and contact shadows
- **Subsurface Scattering**: For translucent materials (skin, ears, etc.)
- **Emission**: For any glowing elements (rarely used)

### Specialized Maps
- **Skin Detail Normal**: Micro-detail for pores and fine wrinkles
- **Fur Direction**: For grooming and hair card orientation
- **Specular Tint**: For colored specular highlights
- **Anisotropy**: For directional highlights (hair, brushed metal)
- **Clearcoat**: For layered materials (wet surfaces, polished areas)

## Naming Conventions

### File Naming Pattern
`[character]_[part]_[map-type]_[resolution].[extension]`

### Examples
- `dog_body_color_4k.png`
- `dog_eyes_normal_2k.png`
- `owner_face_sss_4k.exr`
- `owner_clothing_roughness_4k.png`

## UV Layout Standards

### UV Space Allocation
- **Dog Model**:
  - Head/Face: 50% of UV space
  - Body: 40% of UV space
  - Small details: 10% of UV space

- **Owner Model**:
  - Head/Face: 30% of UV space
  - Body: 30% of UV space
  - Hands: 15% of UV space
  - Feet: 10% of UV space
  - Small details: 15% of UV space

### UV Layout Guidelines
- No overlapping UVs unless for mirrored parts
- Minimize seams on visible areas
- Maintain texel density across surfaces
- Align UV islands to grid where possible
- Keep 2-10 pixel padding between UV islands

## Texture Creation Workflow

### Reference Gathering
1. Collect high-quality reference images for:
   - French Bulldog skin, fur, and features
   - Human skin tones, details, and features
   - Clothing materials and fabric details
   - Hair color and styling references

### Base Texture Creation
1. Create base color maps from reference
2. Develop height/displacement maps for major surface details
3. Generate normal maps for medium-scale details
4. Create roughness maps based on material properties
5. Develop specialized maps (SSS, specular, etc.)

### Detailing Process
1. Add pore and micro-detail to skin surfaces
2. Add wear and tear to appropriate areas
3. Add subtle color variation for realism
4. Create realistic transitions between different materials
5. Add asymmetry and imperfections for realism

### Quality Control
1. Test textures in target rendering engine
2. Check tiling/seam issues
3. Verify proper specular response
4. Ensure consistent scale of details
5. Test under various lighting conditions

## File Formats

### Working Formats
- **EXR**: For HDR maps and multi-channel textures
- **PSD/PSB**: For layered working files
- **TIFF**: For high-quality intermediate files

### Delivery Formats
- **PNG**: For color, roughness, metallic maps (8-bit or 16-bit)
- **EXR**: For displacement, normal, and multi-channel maps
- **JPG**: For reference and preview only (never for production)

## Software Recommendations
- **Substance Painter/Designer**: For procedural texture creation
- **Mari**: For high-resolution hand-painting
- **ZBrush**: For displacement and normal map creation
- **Photoshop**: For detail work and final adjustments
- **Blender Texture Paint**: For direct UV painting

## Special Considerations

### Dog-Specific Texturing
- Subtle color variations in fur
- Proper nose leather texture with moisture
- Translucency in ear tips and thin skin areas
- Wet vs. dry areas (nose, mouth, eyes)

### Human-Specific Texturing
- Realistic skin undertones and subtle variations
- Proper subsurface scattering for ears, fingers
- Realistic lip and eye moisture
- Natural skin imperfections (freckles, moles, etc.)

### Clothing Texturing
- Fabric weave patterns at appropriate scale
- Wear patterns in natural locations
- Seam details and stitching
- Subtle color variations and fading 
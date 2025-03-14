# Owner (Woman) Base Mesh

This directory contains the base mesh files for the female owner model.

## File Structure

- `owner_base_v001.blend` - Base mesh in Blender format
- `owner_base_v001.obj` - Base mesh in OBJ format
- `owner_base_v001.fbx` - Base mesh in FBX format
- `owner_base_highpoly_v001.blend` - High-poly sculpt in Blender format
- `owner_base_midpoly_v001.blend` - Mid-poly retopologized mesh in Blender format
- `owner_base_lowpoly_v001.blend` - Low-poly optimized mesh in Blender format

## Base Mesh Specifications

- **Polygon Count**: 
  - High-poly: ~150,000-250,000 polygons
  - Mid-poly: ~30,000-50,000 polygons
  - Low-poly: ~8,000-15,000 polygons
  
- **Topology**: 
  - Quad-based clean topology
  - Proper edge loops for facial expressions and body deformation
  - Optimized for animation
  
- **UV Mapping**:
  - Properly unwrapped with no overlaps
  - Efficient use of UV space
  - Face and hands given priority in UV space

## Modeling Process

1. **Blocking Phase**: Create basic forms and proportions
2. **Refinement Phase**: Refine the mesh to match reference
3. **Detailing Phase**: Add detailed features and anatomical definition
4. **Retopology Phase**: Create clean topology for animation
5. **UV Mapping Phase**: Create efficient UV layout
6. **LOD Creation Phase**: Generate various LOD versions

## Character Specifications

- **Age**: 30-40 years old
- **Height**: 5'5" to 5'7" (165-170 cm)
- **Build**: Average/realistic body proportions
- **Style**: Casual, comfortable clothing appropriate for dog walking/playing

## Notes

- The base mesh is in T-pose or A-pose
- Symmetry is used where appropriate
- The mesh is prepared for rigging with proper edge loops
- Scale is set to real-world dimensions
- Clothing is modeled as separate meshes

## Reference

See the `../reference` directory for reference images used in creating this model. 
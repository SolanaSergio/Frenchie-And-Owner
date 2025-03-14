# French Bulldog Base Mesh

This directory contains the base mesh files for the French Bulldog model.

## File Structure

- `frenchie_base_v001.blend` - Base mesh in Blender format
- `frenchie_base_v001.obj` - Base mesh in OBJ format
- `frenchie_base_v001.fbx` - Base mesh in FBX format
- `frenchie_base_highpoly_v001.blend` - High-poly sculpt in Blender format
- `frenchie_base_midpoly_v001.blend` - Mid-poly retopologized mesh in Blender format
- `frenchie_base_lowpoly_v001.blend` - Low-poly optimized mesh in Blender format

## Base Mesh Specifications

- **Polygon Count**: 
  - High-poly: ~100,000-150,000 polygons
  - Mid-poly: ~25,000-40,000 polygons
  - Low-poly: ~5,000-10,000 polygons
  
- **Topology**: 
  - Quad-based clean topology
  - Proper edge loops for deformation
  - Optimized for animation
  
- **UV Mapping**:
  - Properly unwrapped with no overlaps
  - Efficient use of UV space
  - Head/face area given priority in UV space

## Modeling Process

1. **Blocking Phase**: Create basic forms and proportions
2. **Refinement Phase**: Refine the mesh to match reference
3. **Detailing Phase**: Add detailed features and muscle definition
4. **Retopology Phase**: Create clean topology for animation
5. **UV Mapping Phase**: Create efficient UV layout
6. **LOD Creation Phase**: Generate various LOD versions

## Notes

- The base mesh is in T-pose or neutral standing pose
- Symmetry is used where appropriate
- The mesh is prepared for rigging with proper edge loops
- Scale is set to real-world dimensions (average French Bulldog size)

## Reference

See the `../reference` directory for reference images used in creating this model. 
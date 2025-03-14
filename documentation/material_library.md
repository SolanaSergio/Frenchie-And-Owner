# Material Library Documentation

This document outlines the materials needed for the French Bulldog and Owner 3D modeling project.

## Material Categories

### French Bulldog Materials

#### Skin Materials

1. **Dog_Skin_Base**
   - **Description**: Base skin material for the French Bulldog
   - **Properties**: 
     - Base Color: Light beige with subtle pink undertones
     - Roughness: 0.7-0.8 (varies by region)
     - Subsurface Scattering: Enabled (0.15 intensity)
     - Normal Intensity: 1.0
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Subsurface Color Map (2K)
     - Displacement Map (optional, 4K)

2. **Dog_Nose**
   - **Description**: Material for the dog's nose
   - **Properties**:
     - Base Color: Dark gray to black
     - Roughness: 0.6
     - Specular: 0.3
     - Normal Intensity: 1.2
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Height Map for nose texture (2K)

3. **Dog_Paw_Pads**
   - **Description**: Material for the paw pads
   - **Properties**:
     - Base Color: Dark pink to light brown
     - Roughness: 0.9
     - Bump Intensity: 0.8
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)

4. **Dog_Tongue**
   - **Description**: Material for the dog's tongue
   - **Properties**:
     - Base Color: Pink with subtle variation
     - Roughness: 0.5
     - Subsurface Scattering: Enabled (0.2 intensity)
     - Specular: 0.4
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (1K)
     - Subsurface Color Map (1K)

5. **Dog_Teeth_Gums**
   - **Description**: Material for teeth and gums
   - **Properties**:
     - Base Color (Teeth): Off-white with slight yellow tint
     - Base Color (Gums): Pink with subtle variation
     - Roughness (Teeth): 0.3
     - Roughness (Gums): 0.7
     - Specular (Teeth): 0.7
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Specular Map (1K)

#### Fur Materials

1. **Dog_Fur_Short_Base**
   - **Description**: Base material for the short fur covering most of the body
   - **Properties**:
     - Base Color: Varies (fawn, brindle, or pied patterns)
     - Roughness: 0.8
     - Anisotropic: 0.4 (direction aligned with fur flow)
     - Fur Length: 0.2-0.3 units
     - Fur Density: High (20,000-30,000 strands)
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Fur Direction Map (2K)
     - Fur Length Map (2K)
     - Fur Density Map (2K)

2. **Dog_Fur_Face**
   - **Description**: Shorter, finer fur for the face region
   - **Properties**:
     - Base Color: Matches body with slight variation
     - Roughness: 0.7
     - Fur Length: 0.1-0.15 units
     - Fur Density: Very High (30,000-40,000 strands)
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Fur Direction Map (2K)
     - Fur Length Map (2K)
     - Fur Density Map (2K)

3. **Dog_Fur_Ears**
   - **Description**: Fine fur for the ears
   - **Properties**:
     - Base Color: Slightly darker than body
     - Roughness: 0.6
     - Fur Length: 0.1 units
     - Fur Density: High (25,000-35,000 strands)
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Fur Direction Map (2K)

4. **Dog_Fur_Markings**
   - **Description**: Material for distinctive markings (if applicable)
   - **Properties**:
     - Base Color: Contrasting color (black, white, etc.)
     - Roughness: 0.8
     - Fur Properties: Match base fur
   - **Maps Required**:
     - Base Color Map (4K)
     - Mask Map for marking patterns (4K)

5. **Dog_Whiskers**
   - **Description**: Material for whiskers
   - **Properties**:
     - Base Color: White to light gray
     - Roughness: 0.3
     - Specular: 0.5
     - Translucency: 0.2
   - **Maps Required**:
     - Base Color Map (1K)
     - Normal Map (1K)

### Owner Materials

#### Skin Materials

1. **Human_Skin_Base**
   - **Description**: Base skin material for the owner
   - **Properties**:
     - Base Color: Medium tone with natural variation
     - Roughness: 0.65-0.75 (varies by region)
     - Subsurface Scattering: Enabled (0.2 intensity)
     - Normal Intensity: 1.0
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Subsurface Color Map (2K)
     - Displacement Map (2K)
     - AO Map (2K)

2. **Human_Face_Details**
   - **Description**: Enhanced detail material for face
   - **Properties**:
     - Base Color: Matches base skin with added detail
     - Roughness: Varies by facial region (0.6-0.8)
     - Subsurface Scattering: Enhanced (0.25 intensity)
     - Pore Detail: High
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (4K)
     - Subsurface Color Map (2K)
     - Displacement Map (4K)
     - Pore Detail Map (4K)
     - AO Map (4K)

3. **Human_Eyes**
   - **Description**: Material for eyes
   - **Properties**:
     - Base Color (Iris): Brown/Blue/Green (as specified)
     - Base Color (Sclera): Off-white with subtle veins
     - Roughness (Cornea): 0.05-0.1
     - Specular (Cornea): 1.0
     - Refraction: Enabled
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Specular Map (2K)
     - Iris Detail Map (2K)

#### Hair Materials

1. **Human_Hair_Base**
   - **Description**: Base material for scalp hair
   - **Properties**:
     - Base Color: Brown (medium to dark)
     - Roughness: 0.4-0.6
     - Anisotropic: 0.8
     - Specular: 0.4
     - Hair Strand Count: 100,000-150,000
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Specular Map (2K)
     - Hair Direction Map (2K)
     - Hair Density Map (2K)

2. **Human_Eyebrows**
   - **Description**: Material for eyebrows
   - **Properties**:
     - Base Color: Slightly darker than scalp hair
     - Roughness: 0.5
     - Hair Strand Count: 5,000-7,000
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (1K)
     - Hair Direction Map (2K)

3. **Human_Eyelashes**
   - **Description**: Material for eyelashes
   - **Properties**:
     - Base Color: Dark brown to black
     - Roughness: 0.3
     - Specular: 0.2
     - Hair Strand Count: 200-300 per eye
   - **Maps Required**:
     - Base Color Map (1K)
     - Alpha Map (1K)

#### Clothing Materials

1. **Fabric_Cotton**
   - **Description**: Material for cotton clothing items
   - **Properties**:
     - Base Color: Various (as specified per item)
     - Roughness: 0.8
     - Normal Intensity: 0.7
     - Fabric Weave: Visible at close range
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Fabric Detail Map (2K)
     - AO Map (2K)

2. **Fabric_Denim**
   - **Description**: Material for denim items (jeans)
   - **Properties**:
     - Base Color: Blue (various washes)
     - Roughness: 0.9
     - Normal Intensity: 1.0
     - Fabric Weave: Distinctive denim pattern
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Fabric Detail Map (4K)
     - Wear Map (2K)
     - AO Map (2K)

3. **Leather**
   - **Description**: Material for leather items (shoes, belt)
   - **Properties**:
     - Base Color: Brown/Black (as specified)
     - Roughness: 0.5-0.7
     - Specular: 0.3
     - Normal Intensity: 0.8
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Specular Map (2K)
     - Wear Map (2K)

4. **Metal_Accessories**
   - **Description**: Material for metal accessories (buttons, zippers)
   - **Properties**:
     - Base Color: Silver/Gold/Brass (as specified)
     - Roughness: 0.1-0.3
     - Metallic: 0.9-1.0
     - Normal Intensity: 0.6
   - **Maps Required**:
     - Base Color Map (2K)
     - Normal Map (2K)
     - Roughness Map (2K)
     - Metallic Map (2K)

### Environment Materials

1. **Grass**
   - **Description**: Material for the ground in the park scene
   - **Properties**:
     - Base Color: Various greens with variation
     - Roughness: 0.9
     - Normal Intensity: 1.0
     - Displacement: Subtle height variation
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - Displacement Map (2K)

2. **Wood**
   - **Description**: Material for wooden elements (benches)
   - **Properties**:
     - Base Color: Brown with wood grain
     - Roughness: 0.7-0.8
     - Normal Intensity: 0.9
   - **Maps Required**:
     - Base Color Map (4K)
     - Normal Map (4K)
     - Roughness Map (2K)
     - AO Map (2K)

## Material Creation Workflow

1. **Reference Gathering**
   - Collect reference images for each material
   - Analyze real-world properties (color, reflectivity, texture)
   - Document reference sources

2. **Base Material Creation**
   - Create PBR-compliant base materials
   - Set up basic properties (color, roughness, metallic)
   - Test in neutral lighting environment

3. **Material Variations**
   - Create variations as needed (e.g., different fur patterns)
   - Ensure consistent properties across variations
   - Document variation parameters

4. **Testing**
   - Test materials in target lighting conditions
   - Verify appearance at different distances
   - Check performance impact
   - Validate against reference images

5. **Organization**
   - Group materials by category
   - Apply consistent naming convention
   - Document material properties and maps

## Material Improvements

The following improvements have been implemented in the latest version:

### French Bulldog Material Enhancements

1. **Improved Skin Materials**:
   - Enhanced subsurface scattering for more realistic skin appearance
   - Added micro-detail normal maps for subtle skin texture
   - Improved nose material with better moisture and specular response
   - Enhanced paw pad materials with more realistic texture and wear patterns

2. **Enhanced Fur System**:
   - Increased fur density for more realistic appearance
   - Improved fur direction maps for natural flow patterns
   - Added subtle color variation within fur strands
   - Implemented better fur shadowing and self-shadowing
   - Optimized fur rendering for better performance

3. **Facial Feature Improvements**:
   - Enhanced eye materials with better corneal refraction
   - Improved teeth and gum materials with subtle translucency
   - Added subtle wetness to tongue and mouth interior
   - Enhanced whisker materials with better light transmission

### Owner Material Enhancements

1. **Improved Skin System**:
   - Added multi-layer subsurface scattering for more realistic skin
   - Implemented advanced pore detail system
   - Enhanced facial detail maps for more natural appearance
   - Added subtle color variation for more realistic skin tone

2. **Enhanced Hair System**:
   - Implemented improved hair shader with better anisotropic response
   - Added multi-colored strands for more natural appearance
   - Improved hair self-shadowing and ambient occlusion
   - Enhanced eyebrow and eyelash materials

3. **Clothing Material Improvements**:
   - Added fabric weave detail with normal and displacement maps
   - Implemented subtle wear patterns on clothing items
   - Enhanced denim material with realistic thread pattern
   - Improved leather materials with better specular response
   - Added realistic metal materials for accessories

### Environment Material Enhancements

1. **Ground Materials**:
   - Enhanced grass texture with multi-layered detail
   - Added subtle terrain variation with displacement mapping
   - Implemented better blending between different ground materials

2. **Structural Materials**:
   - Improved wood materials with realistic grain and weathering
   - Enhanced stone materials with better normal mapping
   - Added subtle moss and dirt accumulation in appropriate areas

## Naming Convention

All materials follow this naming convention:

`[Category]_[Subcategory]_[Specific]_[Variation]`

Examples:
- `Dog_Skin_Base_Fawn`
- `Dog_Fur_Short_Brindle`
- `Human_Skin_Face_Medium`
- `Fabric_Cotton_TShirt_Blue`

## Directory Structure

Materials are organized in the following directory structure:

```
/materials
  /dog
    /skin
    /fur
    /details
  /human
    /skin
    /hair
    /clothing
    /accessories
  /environment
    /ground
    /structures
    /props
  /shared
    /utilities
    /templates
```

## Export Formats

Materials are exported in the following formats:

- **Blender**: .blend material libraries
- **Maya**: .ma/.mb material presets
- **Substance**: .sbsar files
- **Unity**: Material assets and shaders
- **Three.js**: Material JSON definitions

## Documentation

Each material includes the following documentation:

1. Property sheet with all parameters
2. Thumbnail rendering
3. Sample renders in different lighting conditions
4. Performance metrics
5. Usage guidelines 
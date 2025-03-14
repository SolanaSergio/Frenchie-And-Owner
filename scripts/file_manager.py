#!/usr/bin/env python
"""
File Management Script for 3D Model Project
Handles versioning, backups, and export operations for the French Bulldog and Owner project.
"""

import os
import shutil
import datetime
import json
import glob
from pathlib import Path

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent
CONFIG_FILE = PROJECT_ROOT / "scripts" / "config.json"
DEFAULT_CONFIG = {
    "version": "0.1",
    "last_backup": "",
    "backup_frequency": "daily",
    "export_formats": ["obj", "fbx", "glb"],
    "texture_export_formats": ["png", "exr"],
    "texture_resolutions": ["2k", "4k"],
}

def load_config():
    """Load configuration from config file or create default if not exists"""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    else:
        save_config(DEFAULT_CONFIG)
        return DEFAULT_CONFIG

def save_config(config):
    """Save configuration to config file"""
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=4)

def create_version(file_path, description=""):
    """Create a new version of a file"""
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} does not exist")
        return False
    
    # Parse file path
    path, filename = os.path.split(file_path)
    name, ext = os.path.splitext(filename)
    
    # Create versions directory if it doesn't exist
    versions_dir = os.path.join(path, "versions")
    os.makedirs(versions_dir, exist_ok=True)
    
    # Get current datetime
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d_%H%M%S")
    
    # Create new filename with version
    new_filename = f"{name}_v{date_str}{ext}"
    new_path = os.path.join(versions_dir, new_filename)
    
    # Copy file to versions directory
    shutil.copy2(file_path, new_path)
    
    # Add version metadata
    metadata_file = os.path.join(versions_dir, f"{name}_versions.json")
    if os.path.exists(metadata_file):
        with open(metadata_file, 'r') as f:
            metadata = json.load(f)
    else:
        metadata = {"versions": []}
    
    metadata["versions"].append({
        "filename": new_filename,
        "date": now.isoformat(),
        "description": description
    })
    
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    print(f"Created version: {new_filename}")
    return new_path

def create_backup():
    """Create a backup of the entire project"""
    config = load_config()
    
    # Create backups directory if it doesn't exist
    backups_dir = os.path.join(PROJECT_ROOT, "backups")
    os.makedirs(backups_dir, exist_ok=True)
    
    # Get current datetime
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d_%H%M%S")
    
    # Create backup filename
    backup_name = f"project_backup_{date_str}.zip"
    backup_path = os.path.join(backups_dir, backup_name)
    
    # Create backup
    print(f"Creating backup: {backup_path}")
    shutil.make_archive(
        os.path.join(backups_dir, f"project_backup_{date_str}"),
        'zip',
        PROJECT_ROOT,
        base_dir='.'
    )
    
    # Update config
    config["last_backup"] = now.isoformat()
    save_config(config)
    
    print(f"Backup created: {backup_path}")
    return backup_path

def export_model(source_file, target_formats=None, lod=None):
    """Export a model to different formats"""
    if not os.path.exists(source_file):
        print(f"Error: File {source_file} does not exist")
        return False
    
    config = load_config()
    if target_formats is None:
        target_formats = config["export_formats"]
    
    # Parse file path
    path, filename = os.path.split(source_file)
    name, ext = os.path.splitext(filename)
    
    # Create exports directory if it doesn't exist
    exports_dir = os.path.join(PROJECT_ROOT, "exports")
    os.makedirs(exports_dir, exist_ok=True)
    
    # Get current datetime
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d")
    
    # Determine export directory
    if "dog" in source_file.lower():
        model_type = "dog"
    elif "owner" in source_file.lower() or "woman" in source_file.lower():
        model_type = "owner"
    else:
        model_type = "other"
    
    model_export_dir = os.path.join(exports_dir, model_type)
    os.makedirs(model_export_dir, exist_ok=True)
    
    # Handle LOD suffix
    lod_suffix = ""
    if lod:
        lod_suffix = f"_LOD{lod}"
    
    # List of exported files
    exported_files = []
    
    # Export to each format
    for fmt in target_formats:
        export_name = f"{name}{lod_suffix}_{date_str}.{fmt}"
        export_path = os.path.join(model_export_dir, export_name)
        
        # This is where the actual export code would go
        # In reality, this would use an external tool or library to convert formats
        # For this script, we'll just simulate the export
        print(f"Exporting {source_file} to {export_path}")
        
        # Simulate export by creating empty file
        with open(export_path, 'w') as f:
            f.write(f"# This is a placeholder for {name} exported to {fmt}\n")
        
        exported_files.append(export_path)
    
    return exported_files

def export_textures(texture_dir, target_formats=None, resolutions=None):
    """Export textures to different formats and resolutions"""
    if not os.path.isdir(texture_dir):
        print(f"Error: Directory {texture_dir} does not exist")
        return False
    
    config = load_config()
    if target_formats is None:
        target_formats = config["texture_export_formats"]
    if resolutions is None:
        resolutions = config["texture_resolutions"]
    
    # Create exports directory if it doesn't exist
    exports_dir = os.path.join(PROJECT_ROOT, "exports", "textures")
    os.makedirs(exports_dir, exist_ok=True)
    
    # Get current datetime
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d")
    
    # Determine export directory based on texture directory
    if "dog" in texture_dir.lower():
        model_type = "dog"
    elif "owner" in texture_dir.lower() or "woman" in texture_dir.lower():
        model_type = "owner"
    else:
        model_type = "shared"
    
    texture_export_dir = os.path.join(exports_dir, model_type)
    os.makedirs(texture_export_dir, exist_ok=True)
    
    # Find all texture files
    texture_files = []
    for ext in ["png", "jpg", "tga", "exr", "psd"]:
        texture_files.extend(glob.glob(os.path.join(texture_dir, f"*.{ext}")))
    
    # List of exported files
    exported_files = []
    
    # Export each texture
    for texture_file in texture_files:
        path, filename = os.path.split(texture_file)
        name, ext = os.path.splitext(filename)
        
        # Export to each format and resolution
        for fmt in target_formats:
            for res in resolutions:
                export_name = f"{name}_{res}_{date_str}.{fmt}"
                export_path = os.path.join(texture_export_dir, export_name)
                
                # This is where actual texture conversion would happen
                # For this script, we'll just simulate the export
                print(f"Exporting {texture_file} to {export_path}")
                
                # Simulate export by creating empty file
                with open(export_path, 'w') as f:
                    f.write(f"# This is a placeholder for {name} at {res} exported to {fmt}\n")
                
                exported_files.append(export_path)
    
    return exported_files

def validate_model(model_file):
    """Basic model validation checks"""
    if not os.path.exists(model_file):
        print(f"Error: File {model_file} does not exist")
        return False
    
    # This is where actual model validation would happen
    # For this script, we'll just simulate some checks
    print(f"Validating model: {model_file}")
    
    # Check file size
    file_size = os.path.getsize(model_file)
    print(f"File size: {file_size} bytes")
    
    # Check file extension
    _, ext = os.path.splitext(model_file)
    valid_extensions = [".obj", ".fbx", ".blend", ".ma", ".mb", ".max", ".glb", ".gltf"]
    
    if ext.lower() not in valid_extensions:
        print(f"Warning: File extension {ext} is not a standard 3D model format")
        return False
    
    # In a real implementation, this would check:
    # - Mesh integrity
    # - UV mapping
    # - Material assignments
    # - Rig validation
    # - etc.
    
    print("Validation complete")
    return True

if __name__ == "__main__":
    # Example usage
    print("3D Model Project File Manager")
    print("=" * 30)
    print("1. Create Version")
    print("2. Create Backup")
    print("3. Export Model")
    print("4. Export Textures")
    print("5. Validate Model")
    
    choice = input("Enter choice: ")
    
    if choice == "1":
        file_path = input("Enter file path: ")
        desc = input("Enter version description: ")
        create_version(file_path, desc)
    elif choice == "2":
        create_backup()
    elif choice == "3":
        file_path = input("Enter model path: ")
        export_model(file_path)
    elif choice == "4":
        dir_path = input("Enter textures directory: ")
        export_textures(dir_path)
    elif choice == "5":
        file_path = input("Enter model path: ")
        validate_model(file_path)
    else:
        print("Invalid choice") 
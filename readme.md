# Client Banners

Modern banner development workflow using Vite + PostCSS build system with GitHub Actions deployment.

## 🚀 Quick Start Commands

### Development

```bash
npm run dev                    # Start development server for all banners (with timeline controls)
npm run dev:banner <name>      # Start development server for specific banner (with timeline controls)
npm run dev:list               # List available banners
```

> **Note**: Development mode automatically includes timeline controls (tween bar) for GSAP animations.

### Building & Review

```bash
npm run build                  # Build all banners for production
npm run review                 # Build and generate review page
npm run preview                # Preview built banners
```

### Banner Generation

```bash
npm run generate:banners <sizes...>  # Generate specific banner sizes
npm run generate:standard            # Generate all standard IAB sizes
npm run banners:list                 # List existing banners
npm run banners:cleanup <sizes...>   # Remove specific banner sizes
```

### Deployment

```bash
npm run deploy                 # Create zip files for ad platform distribution
npm run deploy:clean           # Clean deployment directory
```

## 📁 Starting a New Banner Project

1. **Duplicate Template**: Copy the `/_template/` folder and rename it with your job number/client code (e.g., `tac25027`, `tac25027`)

2. **Update Project Info**: Edit `package.json` in your new project folder:

   ```json
   {
     "name": "12-client-jobnum", // Update with actual client/job
     "title": "Client Campaign Name"
   }
   ```

3. **Install Dependencies**:

   ```bash
   cd your-project-folder
   npm install
   ```

4. **Start Development**:

   ```bash
   npm run dev                    # All banners
   npm run dev:banner 300x250-1  # Specific banner
   ```

5. **Create Review Site**:

   ```bash
   npm run review
   ```

6. **Deploy**: Push to `main` branch - GitHub Actions will automatically build and deploy

## 🎨 Banner Development Workflow

### Development Controls (Tween Bar)

When running in development mode (`npm run dev` or `npm run dev:banner`), banner controls are automatically injected into your banner. These controls provide:

- **Play/Pause Button**: Control animation playback
- **Timeline Scrubber**: Drag to any point in the animation timeline
- **Time Display**: Shows current time / total duration

The controls appear at the bottom of the page and work with GSAP Timeline animations. They're automatically removed in production builds.

### Creating Banners

**Option 1: Manual Creation**

1. Duplicate `banners/_banner-template/`
2. Rename to banner size (e.g., `300x250-1`)
3. Edit `assets/css/source.css` for styling
4. Edit `assets/js/script.js` for animations
5. Template variables `{{width}}` and `{{height}}` are auto-replaced

**Option 2: Automated Generation (Recommended)**

```bash
# Generate specific sizes
npm run generate:banners 300x250 728x90 970x250

# Generate all standard IAB sizes
npm run generate:standard

# List existing banners
npm run banners:list
```

### Template Variables

- `{{width}}` - Banner width (extracted from folder name)
- `{{height}}` - Banner height (extracted from folder name)
- Variables work in HTML, CSS, and JS files

### CSS Features (PostCSS)

- **Variables**: `$width: 300px;`
- **Position shortcuts**: `absolute: top left right bottom;`
- **Calc**: `width: calc(100% - 20px);`
- **Autoprefixer**: Automatic vendor prefixes
- **CSS sorting**: Zen-style property ordering

## 🔄 Deployment & CI/CD

### Automatic Deployment

- **Push to main** → Builds and deploys to GitHub Pages
- **Pull requests** → Creates preview artifacts with download links
- **Git tags** → Creates releases with deployment packages

### GitHub Actions Workflows

- **Main deployment**: Builds and deploys on push to main
- **PR previews**: Builds artifacts for pull request review
- **Releases**: Creates tagged releases with ZIP packages

### Manual Commands

```bash
# Create deployment ZIPs
npm run deploy

# Clean deployment directory
npm run deploy:clean

# Process templates only
npm run process-templates
```

## 📊 Project Structure

```
your-project/
├── banners/                   # Banner source files
│   ├── _banner-template/      # Template for new banners
│   ├── 300x250-1/            # Individual banner
│   └── 728x90-1/             # Another banner size
├── build-scripts/             # Build automation scripts
├── _review/                   # Generated review site
├── _deploy/                   # Generated ZIP files
├── vite.config.js            # Build configuration
├── postcss.config.js         # CSS processing config
└── package.json              # Project configuration
```

## 🛠 Available Scripts

| Command                            | Description                            |
| ---------------------------------- | -------------------------------------- |
| `npm run dev`                      | Start development server (all banners) |
| `npm run dev:banner <name>`        | Develop specific banner                |
| `npm run dev:list`                 | List available banners                 |
| `npm run build`                    | Build all banners                      |
| `npm run review`                   | Generate review page                   |
| `npm run deploy`                   | Create deployment ZIPs                 |
| `npm run preview`                  | Preview built banners                  |
| `npm run generate:banners <sizes>` | Generate specific banner sizes         |
| `npm run generate:standard`        | Generate all standard IAB sizes        |
| `npm run banners:list`             | List existing banners                  |
| `npm run banners:cleanup <sizes>`  | Remove specific banner sizes           |

## 📚 Documentation Notes

- [Build Migration Guide](BUILD_MIGRATION.md) - Complete migration details
- [GitHub Actions Guide](GITHUB_ACTIONS_MIGRATION.md) - CI/CD setup
- [Vite Documentation](https://vitejs.dev/) - Build tool docs
- [PostCSS Documentation](https://postcss.org/) - CSS processing

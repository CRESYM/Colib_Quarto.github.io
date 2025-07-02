# Collaborative Open-Source Dynamic Simulation Library

The power system and energy systems at large experience a paradigm shift with many novel , active components connected. Appraising the behavior and reactions of such new items is critical for network operators to simulate and anticipate system operation, and for this, available, reliable up to date and possibly specifically targeted component models are required.

At present, on one hand, operators manage to gather and build pragmatically a model database of the components directly connected to their network. They remain however blind or use rough proxies to cope with:
-	Components indirectly connected (e.g. to neighboring, coupled networks, such as electricity or gas grids ; and/or quite likely in a soon future: across sectors )
-	Future connected ones (components at design stage, latest technology, and proprietary manufacturer models). 
On the other hand, research also suffers from the lack of all the necessary component models and is slowed down by the effort required to circumvent it.

They both face the need for a collaborative shared dynamic simulation library that would benefit to all by its high quality, transparency of model equations, and concrete applications (real test cases).

In this Colib workspace, we aim at addressing  power systems components, networks, and small and large test cases for steady-state and dynamic stability studies.
For each of them, the description of the object is presented on one side, and the links to open source implementations with indicators on the quality on the other side.

## 🚀 Installation and Setup

### Prerequisites

- [Quarto](https://quarto.org/) (version 1.3 or higher)
- Git

### Installation

1. **Install Quarto**
   
   Download and install Quarto from the [official website](https://quarto.org/docs/get-started/):
   
   ```bash
   # On macOS (using Homebrew)
   brew install quarto
   
   # On Ubuntu/Debian
   sudo curl -LO https://quarto.org/download/latest/quarto-linux-amd64.deb
   sudo gdebi quarto-linux-amd64.deb
   
   # On Windows
   # Download the installer from https://quarto.org/docs/get-started/
   ```

2. **Clone the repository**
   
   ```bash
   git clone https://github.com/CRESYM/Colib_Quarto.github.io.git
   cd colib_quarto
   ```

3. **Build and serve the website locally**
   
   ```bash
   # Preview the website (auto-reloads on changes)
   quarto preview
   
   # Or build the website
   quarto render
   ```

4. **View the website**
   
   Open your browser and navigate to `http://localhost:port` (the port will be displayed in the terminal after running `quarto preview`).

### Development

- **Live Preview**: Use `quarto preview` for live reloading during development
- **Content**: Edit `.qmd` files to modify website content
- **Styling**: Modify `styles.css` for custom styling
- **Configuration**: Update `_quarto.yml` for website settings

## 🤝 Contributing

Want to contribute? Go see: [How to contribute page](/pages/about/contribute)


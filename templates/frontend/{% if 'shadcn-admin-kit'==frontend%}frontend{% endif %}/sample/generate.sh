#!/bin/bash
# Script to generate sample projects from the axum-template using baker
# Usage: ./generate.sh [rest|grpc|all] [output_directory]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")"
PROTOCOL="${1:-all}"
BASE_OUTPUT_DIR="${2:-$SCRIPT_DIR/generated}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Generating sample project(s) from axum-template"
echo "   Template: $TEMPLATE_DIR"
echo "   Protocol: $PROTOCOL"
echo "   Output:   $BASE_OUTPUT_DIR"
echo ""

# Check if baker is installed
if ! command -v baker &> /dev/null; then
    echo -e "${RED}❌ Error: baker is not installed${NC}"
    echo "   Install with: cargo install baker --locked"
    exit 1
fi

generate_project() {
    local protocol=$1
    local answers_file="$SCRIPT_DIR/answers-${protocol}.yaml"
    local output_dir="$BASE_OUTPUT_DIR/${protocol}"

    echo -e "${YELLOW}⚙️  Generating ${protocol^^} project...${NC}"

    # Check if answers file exists
    if [ ! -f "$answers_file" ]; then
        echo -e "${RED}❌ Error: answers-${protocol}.yaml not found at $answers_file${NC}"
        return 1
    fi

    # Remove existing generated directory if it exists
    if [ -d "$output_dir" ]; then
        echo "   🗑️  Removing existing ${protocol} directory..."
        rm -rf "$output_dir"
    fi

    # Generate the project
    mkdir -p "$output_dir"
    baker "$TEMPLATE_DIR" "$output_dir" --answers "$answers_file" --non-interactive --skip-confirms all

    echo -e "${GREEN}✅ ${protocol^^} project generated at $output_dir${NC}"
    echo ""
}

case "$PROTOCOL" in
    rest)
        generate_project "rest"
        ;;
    grpc)
        generate_project "grpc"
        ;;
    all)
        generate_project "rest"
        generate_project "grpc"
        ;;
    *)
        echo -e "${RED}❌ Error: Unknown protocol '$PROTOCOL'${NC}"
        echo "   Usage: $0 [rest|grpc|all] [output_directory]"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ All sample projects generated successfully!${NC}"
echo ""
echo "📁 Next steps:"
echo "   cd $BASE_OUTPUT_DIR/rest  # or grpc"
echo "   cargo build"
echo "   cargo test"
echo ""

// Default data for each block type
export const DEFAULT_BLOCK_DATA = {
  Text: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
      color: '#262626',
      fontSize: 16,
    },
    props: { 
      text: 'Enter your text here...' 
    },
  },
  Heading: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
      color: '#262626',
      fontSize: 24,
      fontWeight: 'bold',
    },
    props: { 
      text: 'Heading Text',
      level: 'h2',
    },
  },
  Button: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
      backgroundColor: '#6366F1',
      color: '#FFFFFF',
      borderRadius: 4,
      fontSize: 16,
      textAlign: 'center',
    },
    props: { 
      text: 'Click Me',
      url: '#',
      buttonBackgroundColor: '#6366F1',
      buttonColor: '#FFFFFF',
    },
  },
  Image: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
    },
    props: { 
      url: 'https://via.placeholder.com/600x400',
      alt: 'Image',
      contentAlignment: 'middle',
    },
  },
  Avatar: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
    },
    props: { 
      imageUrl: 'https://via.placeholder.com/150',
      alt: 'Avatar',
      shape: 'circle',
      size: 64,
    },
  },
  Divider: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
    },
    props: { 
      lineColor: '#E5E7EB',
      lineHeight: 1,
    },
  },
  Spacer: {
    style: {},
    props: { 
      height: 32,
    },
  },
  Container: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
      backgroundColor: '#F9FAFB',
      borderRadius: 4,
    },
    props: { 
      childrenIds: [],
    },
  },
  ColumnsContainer: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
    },
    props: { 
      columns: [
        { childrenIds: [] },
        { childrenIds: [] },
        { childrenIds: [] },
      ],
    },
  },
  Html: {
    style: { 
      padding: { top: 16, bottom: 16, right: 24, left: 24 },
    },
    props: { 
      contents: '<div>Custom HTML content</div>',
    },
  },
};

/**
 * Create a new block with default data
 * @param {string} blockType - The type of block to create
 * @returns {object} Block object with type and data properties
 */
export function createBlock(blockType) {
  const defaultData = DEFAULT_BLOCK_DATA[blockType];
  
  if (!defaultData) {
    console.warn(`No default data for block type: ${blockType}`);
    return {
      type: blockType,
      data: {
        style: { padding: { top: 16, bottom: 16, right: 24, left: 24 } },
        props: {},
      },
    };
  }

  return {
    type: blockType,
    data: { ...defaultData },
  };
}

/**
 * Generate a unique block ID
 * @returns {string} Unique block ID
 */
export function generateBlockId() {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

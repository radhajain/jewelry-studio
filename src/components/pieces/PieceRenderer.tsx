import React from 'react';
import { JewelryPiece } from '../../types';
import { getGemstoneById } from '../../data/gemstones';
import styles from './PieceRenderer.module.css';

interface PieceRendererProps {
  piece: Partial<JewelryPiece>;
  size?: number;
}

const METAL_COLORS: Record<string, string> = {
  'yellow-gold': '#D4AF37',
  'white-gold': '#E5E4E2',
  'rose-gold': '#B76E79',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
};

const PieceRenderer: React.FC<PieceRendererProps> = ({ piece, size = 400 }) => {
  const metalColor = METAL_COLORS[piece.design?.metal || 'yellow-gold'] || '#D4AF37';
  const finish = piece.design?.finish || 'polished';

  // Get gemstone color from library
  const gemstone = piece.design?.primaryGemstone
    ? getGemstoneById(piece.design.primaryGemstone.gemstoneId)
    : null;
  const gemstoneColor = gemstone?.color || '#4ECDC4';

  // Adjust opacity based on finish
  const opacity = finish === 'matte' ? 0.7 : 1;
  const strokeWidth = finish === 'hammered' ? 2 : 1;

  const renderRing = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.35;
    const innerRadius = size * 0.28;
    const bandWidth = outerRadius - innerRadius;

    return (
      <g>
        {/* Outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke={metalColor}
          strokeWidth={bandWidth}
          opacity={opacity}
        />

        {/* Add texture for hammered finish */}
        {finish === 'hammered' && (
          <>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = centerX + Math.cos(rad) * outerRadius;
              const y = centerY + Math.sin(rad) * outerRadius;
              return (
                <circle
                  key={angle}
                  cx={x}
                  cy={y}
                  r={2}
                  fill={metalColor}
                  opacity={0.4}
                />
              );
            })}
          </>
        )}

        {/* Add gemstone if exists */}
        {piece.design?.primaryGemstone && (
          <circle
            cx={centerX}
            cy={centerY - outerRadius - 8}
            r={12}
            fill={gemstoneColor}
            stroke={metalColor}
            strokeWidth={2}
          />
        )}
      </g>
    );
  };

  const renderEarring = () => {
    const centerX = size / 2;
    const topY = size * 0.25;
    const hookRadius = size * 0.08;

    return (
      <g>
        {/* Hook */}
        <path
          d={`M ${centerX - hookRadius} ${topY} Q ${centerX} ${topY - hookRadius * 2}, ${centerX + hookRadius} ${topY}`}
          fill="none"
          stroke={metalColor}
          strokeWidth={3}
          opacity={opacity}
        />

        {/* Drop or stud */}
        <circle
          cx={centerX}
          cy={topY + size * 0.15}
          r={size * 0.12}
          fill={metalColor}
          opacity={opacity}
          strokeWidth={strokeWidth}
          stroke={metalColor}
        />

        {/* Gemstone */}
        {piece.design?.primaryGemstone && (
          <circle
            cx={centerX}
            cy={topY + size * 0.15}
            r={size * 0.08}
            fill={gemstoneColor}
          />
        )}
      </g>
    );
  };

  const renderBracelet = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const rx = size * 0.4;
    const ry = size * 0.25;

    return (
      <g>
        {/* Oval bracelet */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={metalColor}
          strokeWidth={size * 0.08}
          opacity={opacity}
        />

        {/* Add links texture */}
        {finish === 'hammered' && (
          <>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = centerX + Math.cos(rad) * rx;
              const y = centerY + Math.sin(rad) * ry;
              return (
                <line
                  key={angle}
                  x1={x - 3}
                  y1={y}
                  x2={x + 3}
                  y2={y}
                  stroke={metalColor}
                  strokeWidth={1}
                  opacity={0.5}
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  const renderNecklace = () => {
    const centerX = size / 2;
    const topY = size * 0.2;
    const bottomY = size * 0.7;

    // Chain path (curved arc)
    const pathData = `M ${size * 0.15} ${topY} Q ${centerX} ${bottomY}, ${size * 0.85} ${topY}`;

    return (
      <g>
        {/* Chain */}
        <path
          d={pathData}
          fill="none"
          stroke={metalColor}
          strokeWidth={3}
          opacity={opacity}
        />

        {/* Pendant */}
        <circle
          cx={centerX}
          cy={bottomY}
          r={size * 0.1}
          fill={metalColor}
          opacity={opacity}
          strokeWidth={strokeWidth}
          stroke={metalColor}
        />

        {/* Gemstone on pendant */}
        {piece.design?.primaryGemstone && (
          <circle
            cx={centerX}
            cy={bottomY}
            r={size * 0.06}
            fill={gemstoneColor}
          />
        )}
      </g>
    );
  };

  const renderPiece = () => {
    switch (piece.type) {
      case 'ring':
        return renderRing();
      case 'earring':
        return renderEarring();
      case 'bracelet':
        return renderBracelet();
      case 'necklace':
        return renderNecklace();
      default:
        return (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.2}
            fill={metalColor}
            opacity={opacity}
          />
        );
    }
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={styles.renderer}
      style={{ width: '100%', height: '100%' }}
    >
      {renderPiece()}
    </svg>
  );
};

export default PieceRenderer;

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { JewelryPiece, BandStyle, SettingStyle, GemstoneShape, BraceletStyle } from '../../types';
import { getGemstoneById } from '../../data/gemstones';
import { metals, MetalColor } from '../../data/metals';
import styles from './PieceRenderer.module.css';

interface PieceRenderer3DProps {
  piece: Partial<JewelryPiece>;
  size?: number;
}

// Get metal data from metals.ts
const getMetalColors = (metalId: MetalColor | string) => {
  const metal = metals.find((m) => m.id === metalId);
  if (metal) {
    return { start: metal.hexStart, end: metal.hexEnd };
  }
  return { start: '#DFBD69', end: '#926F34' };
};

// Create a gradient texture for metals
const createMetalGradientTexture = (startColor: string, endColor: string): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(0.5, startColor);
  gradient.addColorStop(1, endColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Gemstone component with proper color rendering
interface GemstoneProps {
  position: [number, number, number];
  size: number;
  color: string;
  shape?: GemstoneShape;
  setting?: SettingStyle;
  metalColor?: string;
}

const Gemstone: React.FC<GemstoneProps> = ({
  position,
  size,
  color,
  shape = 'round',
  setting = 'prong',
  metalColor = '#DFBD69'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create gemstone material with proper color - no texture map, just color
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 1.0,
      ior: 2.4,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      reflectivity: 1,
      envMapIntensity: 2,
    });
  }, [color]);

  // Setting material
  const settingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(metalColor),
      metalness: 0.9,
      roughness: 0.1,
    });
  }, [metalColor]);

  const geometry = useMemo(() => {
    switch (shape) {
      case 'oval':
        const ovalGeo = new THREE.SphereGeometry(size, 32, 32);
        ovalGeo.scale(1.3, 0.7, 1);
        return ovalGeo;
      case 'emerald':
        return new THREE.BoxGeometry(size * 1.4, size * 0.6, size * 1.0);
      case 'cushion':
        const cushionGeo = new THREE.BoxGeometry(size * 1.2, size * 0.7, size * 1.2);
        return cushionGeo;
      case 'pear':
        const pearGeo = new THREE.SphereGeometry(size, 32, 32);
        pearGeo.scale(0.8, 0.7, 1.3);
        return pearGeo;
      case 'marquise':
        const marqGeo = new THREE.SphereGeometry(size, 32, 32);
        marqGeo.scale(0.5, 0.6, 1.5);
        return marqGeo;
      case 'heart':
        return new THREE.SphereGeometry(size, 32, 32);
      case 'princess':
        return new THREE.BoxGeometry(size * 1.1, size * 0.7, size * 1.1);
      default: // round
        const roundGeo = new THREE.SphereGeometry(size, 32, 32);
        roundGeo.scale(1, 0.6, 1);
        return roundGeo;
    }
  }, [size, shape]);

  // Render setting based on style
  const renderSetting = () => {
    switch (setting) {
      case 'bezel':
        // Full metal rim around gemstone
        return (
          <mesh position={[position[0], position[1] - size * 0.2, position[2]]}>
            <cylinderGeometry args={[size * 1.15, size * 1.2, size * 0.5, 32]} />
            <primitive object={settingMaterial} attach="material" />
          </mesh>
        );
      case 'pave':
        // Small prongs with accent stones around
        return (
          <group>
            {[0, 90, 180, 270].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = position[0] + Math.cos(rad) * size * 0.9;
              const z = position[2] + Math.sin(rad) * size * 0.9;
              return (
                <mesh key={angle} position={[x, position[1] - size * 0.1, z]}>
                  <sphereGeometry args={[size * 0.15, 8, 8]} />
                  <primitive object={settingMaterial} attach="material" />
                </mesh>
              );
            })}
          </group>
        );
      case 'channel':
        // Metal rails on two sides
        return (
          <group>
            <mesh position={[position[0] - size * 1.1, position[1] - size * 0.15, position[2]]}>
              <boxGeometry args={[size * 0.15, size * 0.5, size * 1.4]} />
              <primitive object={settingMaterial} attach="material" />
            </mesh>
            <mesh position={[position[0] + size * 1.1, position[1] - size * 0.15, position[2]]}>
              <boxGeometry args={[size * 0.15, size * 0.5, size * 1.4]} />
              <primitive object={settingMaterial} attach="material" />
            </mesh>
          </group>
        );
      case 'tension':
        // Metal band gripping from sides
        return (
          <group>
            <mesh position={[position[0] - size * 1.2, position[1], position[2]]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[size * 0.3, size * 0.6, size * 0.3]} />
              <primitive object={settingMaterial} attach="material" />
            </mesh>
            <mesh position={[position[0] + size * 1.2, position[1], position[2]]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[size * 0.3, size * 0.6, size * 0.3]} />
              <primitive object={settingMaterial} attach="material" />
            </mesh>
          </group>
        );
      case 'flush':
        // Gemstone sits flush with surface
        return (
          <mesh position={[position[0], position[1] - size * 0.35, position[2]]}>
            <cylinderGeometry args={[size * 1.05, size * 1.1, size * 0.3, 32]} />
            <primitive object={settingMaterial} attach="material" />
          </mesh>
        );
      default: // prong
        // Four prongs holding the gemstone
        return (
          <group>
            {[0, 90, 180, 270].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = position[0] + Math.cos(rad) * size * 0.85;
              const z = position[2] + Math.sin(rad) * size * 0.85;
              return (
                <mesh key={angle} position={[x, position[1] + size * 0.1, z]}>
                  <cylinderGeometry args={[size * 0.08, size * 0.05, size * 0.5, 8]} />
                  <primitive object={settingMaterial} attach="material" />
                </mesh>
              );
            })}
            {/* Base */}
            <mesh position={[position[0], position[1] - size * 0.3, position[2]]}>
              <cylinderGeometry args={[size * 0.6, size * 0.4, size * 0.2, 32]} />
              <primitive object={settingMaterial} attach="material" />
            </mesh>
          </group>
        );
    }
  };

  // Subtle animation for sparkle effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {renderSetting()}
      <mesh ref={meshRef} position={position} geometry={geometry} material={material} />
    </group>
  );
};

// Ring 3D model
interface Ring3DProps {
  metalColors: { start: string; end: string };
  bandThickness: 'thin' | 'medium' | 'thick';
  bandStyle: BandStyle;
  finish: string;
  gemstone?: { color: string; shape?: GemstoneShape; setting?: SettingStyle };
}

const Ring3D: React.FC<Ring3DProps> = ({ metalColors, bandThickness, bandStyle, finish, gemstone }) => {
  const groupRef = useRef<THREE.Group>(null);

  const bandWidthMap = { thin: 0.08, medium: 0.12, thick: 0.18 };
  const tubeRadius = bandWidthMap[bandThickness] || 0.12;

  const metalTexture = useMemo(() =>
    createMetalGradientTexture(metalColors.start, metalColors.end),
    [metalColors]
  );

  const metalMaterial = useMemo(() => {
    const roughness = finish === 'matte' ? 0.7 : finish === 'brushed' ? 0.5 : finish === 'hammered' ? 0.4 : 0.1;
    return new THREE.MeshStandardMaterial({
      map: metalTexture,
      metalness: 0.9,
      roughness,
      envMapIntensity: 1.5,
    });
  }, [metalTexture, finish]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const renderBandStyle = () => {
    switch (bandStyle) {
      case 'twisted':
        const twistedCurve = new THREE.CatmullRomCurve3(
          Array.from({ length: 64 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2;
            const twist = Math.sin(i * 0.5) * 0.02;
            return new THREE.Vector3(
              Math.cos(angle) * (0.5 + twist),
              Math.sin(angle * 8) * 0.015,
              Math.sin(angle) * (0.5 + twist)
            );
          }),
          true
        );
        return <mesh>
          <tubeGeometry args={[twistedCurve, 128, tubeRadius, 16, true]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>;

      case 'braided':
        const braidedElements = [];
        for (let strand = 0; strand < 3; strand++) {
          const braidCurve = new THREE.CatmullRomCurve3(
            Array.from({ length: 64 }, (_, i) => {
              const angle = (i / 64) * Math.PI * 2;
              const offset = (strand * Math.PI * 2) / 3;
              const braid = Math.sin(angle * 6 + offset) * 0.03;
              return new THREE.Vector3(
                Math.cos(angle) * (0.5 + braid),
                Math.sin(angle * 6 + offset) * 0.02,
                Math.sin(angle) * (0.5 + braid)
              );
            }),
            true
          );
          braidedElements.push(
            <mesh key={strand}>
              <tubeGeometry args={[braidCurve, 128, tubeRadius * 0.5, 12, true]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
          );
        }
        return <>{braidedElements}</>;

      case 'split':
        return <>
          <mesh position={[0, 0.02, 0]}>
            <torusGeometry args={[0.5, tubeRadius * 0.5, 16, 64]} />
            <primitive object={metalMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <torusGeometry args={[0.5, tubeRadius * 0.5, 16, 64]} />
            <primitive object={metalMaterial} attach="material" />
          </mesh>
        </>;

      case 'textured':
        return <>
          <mesh>
            <torusGeometry args={[0.5, tubeRadius, 16, 64]} />
            <primitive object={metalMaterial} attach="material" />
          </mesh>
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <primitive object={metalMaterial} attach="material" />
              </mesh>
            );
          })}
        </>;

      default: // plain
        return (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, tubeRadius, 32, 64]} />
            <primitive object={metalMaterial} attach="material" />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {renderBandStyle()}
      {gemstone && (
        <Gemstone
          position={[0, 0.15, -0.5]}
          size={0.1}
          color={gemstone.color}
          shape={gemstone.shape}
          setting={gemstone.setting}
          metalColor={metalColors.start}
        />
      )}
    </group>
  );
};

// Earring 3D models
interface Earring3DProps {
  metalColors: { start: string; end: string };
  earringStyle: 'stud' | 'hoop' | 'drop' | 'chandelier';
  finish: string;
  gemstone?: { color: string; shape?: GemstoneShape; setting?: SettingStyle };
}

const Earring3D: React.FC<Earring3DProps> = ({ metalColors, earringStyle, finish, gemstone }) => {
  const groupRef = useRef<THREE.Group>(null);

  const metalTexture = useMemo(() =>
    createMetalGradientTexture(metalColors.start, metalColors.end),
    [metalColors]
  );

  const metalMaterial = useMemo(() => {
    const roughness = finish === 'matte' ? 0.7 : finish === 'brushed' ? 0.5 : 0.1;
    return new THREE.MeshStandardMaterial({
      map: metalTexture,
      metalness: 0.9,
      roughness,
      envMapIntensity: 1.5,
    });
  }, [metalTexture, finish]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const renderEarringStyle = () => {
    switch (earringStyle) {
      case 'stud':
        return (
          <group>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.25, 0.22, 0.08, 32]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {gemstone && (
              <Gemstone
                position={[0, 0.1, 0]}
                size={0.15}
                color={gemstone.color}
                shape={gemstone.shape}
                setting={gemstone.setting}
                metalColor={metalColors.start}
              />
            )}
          </group>
        );

      case 'hoop':
        return (
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.4, 0.04, 16, 64]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {gemstone && (
              <>
                <Gemstone position={[-0.35, 0, 0]} size={0.06} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
                <Gemstone position={[0, -0.4, 0]} size={0.07} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
                <Gemstone position={[0.35, 0, 0]} size={0.06} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
              </>
            )}
          </group>
        );

      case 'chandelier':
        return (
          <group>
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[0.08, 0.015, 16, 32, Math.PI]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <capsuleGeometry args={[0.05, 0.12, 8, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {[-1, 0, 1].map((offset) => (
              <group key={offset}>
                <mesh position={[offset * 0.2, 0, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.25, 16]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
                <mesh position={[offset * 0.2, -0.15 - Math.abs(offset) * 0.05, 0]}>
                  <capsuleGeometry args={[0.04, 0.08, 8, 16]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
              </group>
            ))}
            {[-0.5, 0.5].map((offset, i) => (
              <group key={`bottom-${i}`}>
                <mesh position={[offset * 0.25, -0.35, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.15, 16]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
                <mesh position={[offset * 0.25, -0.45, 0]}>
                  <capsuleGeometry args={[0.03, 0.06, 8, 16]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
              </group>
            ))}
            {gemstone && (
              <>
                <Gemstone position={[0, 0.2, 0.06]} size={0.04} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
                <Gemstone position={[0, -0.15, 0.05]} size={0.035} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
                <Gemstone position={[-0.2, -0.2, 0.04]} size={0.03} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
                <Gemstone position={[0.2, -0.2, 0.04]} size={0.03} color={gemstone.color} shape={gemstone.shape} metalColor={metalColors.start} />
              </>
            )}
          </group>
        );

      default: // drop
        return (
          <group>
            <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.1, 0.02, 16, 32, Math.PI]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.2, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.12, 0.25, 16, 32]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {gemstone && (
              <Gemstone
                position={[0, 0, 0.13]}
                size={0.1}
                color={gemstone.color}
                shape={gemstone.shape}
                setting={gemstone.setting}
                metalColor={metalColors.start}
              />
            )}
          </group>
        );
    }
  };

  return <group ref={groupRef}>{renderEarringStyle()}</group>;
};

// Bracelet 3D model with multiple styles
interface Bracelet3DProps {
  metalColors: { start: string; end: string };
  finish: string;
  braceletStyle: BraceletStyle;
  chainStyle?: string;
  gemstone?: { color: string; shape?: GemstoneShape; setting?: SettingStyle };
}

const Bracelet3D: React.FC<Bracelet3DProps> = ({ metalColors, finish, braceletStyle, chainStyle, gemstone }) => {
  const groupRef = useRef<THREE.Group>(null);

  const metalTexture = useMemo(() =>
    createMetalGradientTexture(metalColors.start, metalColors.end),
    [metalColors]
  );

  const metalMaterial = useMemo(() => {
    const roughness = finish === 'matte' ? 0.7 : finish === 'brushed' ? 0.5 : 0.1;
    return new THREE.MeshStandardMaterial({
      map: metalTexture,
      metalness: 0.9,
      roughness,
      envMapIntensity: 1.5,
    });
  }, [metalTexture, finish]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const renderBraceletStyle = () => {
    switch (braceletStyle) {
      case 'cuff':
        // Open cuff bracelet (C-shaped)
        return (
          <group>
            {/* Main cuff body - partial torus */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.12, 16, 48, Math.PI * 1.6]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {/* Decorated ends */}
            <mesh position={[0.35, 0, 0.42]} rotation={[0, -0.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            <mesh position={[0.35, 0, -0.42]} rotation={[0, 0.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {/* Gemstone on cuff */}
            {gemstone && (
              <Gemstone
                position={[-0.55, 0.15, 0]}
                size={0.08}
                color={gemstone.color}
                shape={gemstone.shape}
                setting={gemstone.setting}
                metalColor={metalColors.start}
              />
            )}
          </group>
        );

      case 'bangle':
        // Solid closed bangle
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.1, 32, 64]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {/* Decorative pattern */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.03, 0.15, 0.05]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
              );
            })}
            {gemstone && (
              <Gemstone
                position={[-0.55, 0.12, 0]}
                size={0.06}
                color={gemstone.color}
                shape={gemstone.shape}
                metalColor={metalColors.start}
              />
            )}
          </group>
        );

      case 'tennis':
        // Tennis bracelet with continuous gemstones
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.04, 16, 64]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {/* Gemstones around the bracelet */}
            {gemstone && Array.from({ length: 20 }, (_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              return (
                <Gemstone
                  key={i}
                  position={[Math.cos(angle) * 0.55, 0.05, Math.sin(angle) * 0.55]}
                  size={0.04}
                  color={gemstone.color}
                  shape="round"
                  setting="prong"
                  metalColor={metalColors.start}
                />
              );
            })}
          </group>
        );

      case 'charm':
        // Charm bracelet with dangling elements
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.05, 16, 64]} />
              <primitive object={metalMaterial} attach="material" />
            </mesh>
            {/* Charms */}
            {[0, 60, 120, 180, 240, 300].map((angleDeg, i) => {
              const angle = (angleDeg * Math.PI) / 180;
              const shapes = ['sphere', 'box', 'capsule', 'sphere', 'box', 'capsule'];
              return (
                <group key={i} position={[Math.cos(angle) * 0.55, -0.15, Math.sin(angle) * 0.55]}>
                  <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
                    <primitive object={metalMaterial} attach="material" />
                  </mesh>
                  <mesh>
                    {shapes[i] === 'sphere' && <sphereGeometry args={[0.06, 16, 16]} />}
                    {shapes[i] === 'box' && <boxGeometry args={[0.08, 0.08, 0.08]} />}
                    {shapes[i] === 'capsule' && <capsuleGeometry args={[0.03, 0.06, 8, 16]} />}
                    <primitive object={metalMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );

      default: // chain
        // Chain link bracelet
        const renderChainStyle = () => {
          switch (chainStyle) {
            case 'rope':
              // Twisted rope chain
              const ropeCurve = new THREE.CatmullRomCurve3(
                Array.from({ length: 64 }, (_, i) => {
                  const angle = (i / 64) * Math.PI * 2;
                  const twist = Math.sin(i * 0.8) * 0.02;
                  return new THREE.Vector3(
                    Math.cos(angle) * (0.55 + twist),
                    Math.sin(i * 0.8) * 0.02,
                    Math.sin(angle) * (0.55 + twist)
                  );
                }),
                true
              );
              return (
                <mesh>
                  <tubeGeometry args={[ropeCurve, 128, 0.04, 12, true]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
              );
            case 'box':
              // Box chain - square links
              return (
                <>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.55, 0.05, 4, 32]} />
                    <primitive object={metalMaterial} attach="material" />
                  </mesh>
                  {Array.from({ length: 16 }, (_, i) => {
                    const angle = (i / 16) * Math.PI * 2;
                    return (
                      <mesh key={i} position={[Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55]} rotation={[0, -angle, Math.PI / 4]}>
                        <boxGeometry args={[0.06, 0.06, 0.06]} />
                        <primitive object={metalMaterial} attach="material" />
                      </mesh>
                    );
                  })}
                </>
              );
            case 'snake':
              // Smooth snake chain
              return (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.55, 0.06, 32, 64]} />
                  <primitive object={metalMaterial} attach="material" />
                </mesh>
              );
            default: // cable
              // Standard cable chain
              return (
                <>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.55, 0.05, 16, 64]} />
                    <primitive object={metalMaterial} attach="material" />
                  </mesh>
                  {Array.from({ length: 16 }, (_, i) => {
                    const angle = (i / 16) * Math.PI * 2;
                    return (
                      <mesh key={i} position={[Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55]} rotation={[0, -angle, 0]}>
                        <torusGeometry args={[0.04, 0.015, 8, 16]} />
                        <primitive object={metalMaterial} attach="material" />
                      </mesh>
                    );
                  })}
                </>
              );
          }
        };

        return (
          <group>
            {renderChainStyle()}
            {/* Clasp */}
            <group position={[0.55, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.12, 0.06, 0.08]} />
                <primitive object={metalMaterial} attach="material" />
              </mesh>
              {gemstone && (
                <Gemstone
                  position={[0, 0.05, 0]}
                  size={0.03}
                  color={gemstone.color}
                  shape={gemstone.shape}
                  metalColor={metalColors.start}
                />
              )}
            </group>
          </group>
        );
    }
  };

  return <group ref={groupRef}>{renderBraceletStyle()}</group>;
};

// Necklace 3D model
interface Necklace3DProps {
  metalColors: { start: string; end: string };
  finish: string;
  gemstone?: { color: string; shape?: GemstoneShape; setting?: SettingStyle };
}

const Necklace3D: React.FC<Necklace3DProps> = ({ metalColors, finish, gemstone }) => {
  const groupRef = useRef<THREE.Group>(null);

  const metalTexture = useMemo(() =>
    createMetalGradientTexture(metalColors.start, metalColors.end),
    [metalColors]
  );

  const metalMaterial = useMemo(() => {
    const roughness = finish === 'matte' ? 0.7 : finish === 'brushed' ? 0.5 : 0.1;
    return new THREE.MeshStandardMaterial({
      map: metalTexture,
      metalness: 0.9,
      roughness,
      envMapIntensity: 1.5,
    });
  }, [metalTexture, finish]);

  const chainCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.4, 0),
      new THREE.Vector3(-0.6, 0.2, 0.1),
      new THREE.Vector3(-0.3, -0.1, 0.15),
      new THREE.Vector3(0, -0.3, 0.2),
      new THREE.Vector3(0.3, -0.1, 0.15),
      new THREE.Vector3(0.6, 0.2, 0.1),
      new THREE.Vector3(0.8, 0.4, 0),
    ]);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry args={[chainCurve, 64, 0.025, 16, false]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.8, 0.4, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>
      <mesh position={[0.8, 0.4, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>
      <group position={[0, -0.35, 0.2]}>
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[0.04, 0.015, 16, 32, Math.PI]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
        <mesh>
          <capsuleGeometry args={[0.1, 0.15, 16, 32]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
        {gemstone && (
          <Gemstone
            position={[0, 0, 0.12]}
            size={0.08}
            color={gemstone.color}
            shape={gemstone.shape}
            setting={gemstone.setting}
            metalColor={metalColors.start}
          />
        )}
      </group>
    </group>
  );
};

// Scene component
interface SceneProps {
  piece: Partial<JewelryPiece>;
}

const Scene: React.FC<SceneProps> = ({ piece }) => {
  const metalColors = getMetalColors(piece.design?.metal || 'yellow-gold');
  const finish = piece.design?.finish || 'polished';
  const bandThickness = piece.design?.bandThickness || 'medium';
  const bandStyle = piece.design?.bandStyle || 'plain';
  const earringStyle = piece.design?.earringStyle || 'drop';
  const braceletStyle = piece.design?.braceletStyle || 'chain';
  const chainStyle = piece.design?.chainStyle;

  // Get gemstone data
  const gemstoneData = piece.design?.primaryGemstone
    ? getGemstoneById(piece.design.primaryGemstone.gemstoneId)
    : null;

  const gemstone = gemstoneData ? {
    color: gemstoneData.color,
    shape: (piece.design?.primaryGemstone?.shapeOverride || gemstoneData.shape) as GemstoneShape,
    setting: piece.design?.primaryGemstone?.setting,
  } : undefined;

  const renderPiece = () => {
    switch (piece.type) {
      case 'ring':
        return (
          <Ring3D
            metalColors={metalColors}
            bandThickness={bandThickness}
            bandStyle={bandStyle}
            finish={finish}
            gemstone={gemstone}
          />
        );
      case 'earring':
        return (
          <Earring3D
            metalColors={metalColors}
            earringStyle={earringStyle}
            finish={finish}
            gemstone={gemstone}
          />
        );
      case 'bracelet':
        return (
          <Bracelet3D
            metalColors={metalColors}
            finish={finish}
            braceletStyle={braceletStyle}
            chainStyle={chainStyle}
            gemstone={gemstone}
          />
        );
      case 'necklace':
        return (
          <Necklace3D
            metalColors={metalColors}
            finish={finish}
            gemstone={gemstone}
          />
        );
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={metalColors.start} metalness={0.9} roughness={0.1} />
          </mesh>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1.2} castShadow />
      <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={0.6} />
      <pointLight position={[0, -5, 0]} intensity={0.4} />

      {renderPiece()}

      <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={3} blur={2} />
      <Environment preset="studio" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={1.5}
        maxDistance={4}
      />
    </>
  );
};

// Main component
const PieceRenderer3D: React.FC<PieceRenderer3DProps> = ({ piece, size = 400 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = React.useState(false);

  const handleContextLost = React.useCallback(() => {
    setContextLost(true);
  }, []);

  const handleContextRestored = React.useCallback(() => {
    setContextLost(false);
  }, []);

  if (contextLost) {
    return (
      <div className={styles.renderer} style={{ width: size, height: size }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '12px'
        }}>
          3D preview unavailable
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.renderer} style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
          preserveDrawingBuffer: false,
        }}
        frameloop="always"
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', handleContextLost);
          gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
        }}
      >
        <Scene piece={piece} />
      </Canvas>
    </div>
  );
};

export default PieceRenderer3D;

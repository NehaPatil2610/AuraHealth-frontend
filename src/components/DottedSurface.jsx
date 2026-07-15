import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '../contexts/ThemeContext'

const SEPARATION = 150
const AMOUNTX = 40
const AMOUNTY = 60

// Wave + size pulse run entirely on the GPU from a single uTime uniform, so the
// animation is smooth and cheap (no per-frame CPU array writes). Grid index of
// each point is passed as aGrid so the math matches the classic waves demo.
const VERTEX_SHADER = /* glsl */ `
    attribute vec2 aGrid;
    attribute vec3 aColor;
    uniform float uTime;
    varying vec3 vColor;

    void main() {
        vColor = aColor;

        vec3 p = position;
        p.y = sin((aGrid.x + uTime) * 0.3) * 50.0
            + sin((aGrid.y + uTime) * 0.5) * 50.0;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);

        // Pulsing point size (the shimmer), with perspective attenuation.
        float pulse = (sin((aGrid.x + uTime) * 0.3) + 1.0)
                    + (sin((aGrid.y + uTime) * 0.5) + 1.0);
        float size = 6.0 + pulse * 4.0;
        gl_PointSize = clamp(size * (1000.0 / -mv.z), 1.0, 40.0);

        gl_Position = projectionMatrix * mv;
    }
`

const FRAGMENT_SHADER = /* glsl */ `
    precision mediump float;
    uniform float uOpacity;
    varying vec3 vColor;

    void main() {
        // Round the square GL point into a dot.
        vec2 c = gl_PointCoord - vec2(0.5);
        if (dot(c, c) > 0.25) discard;
        gl_FragColor = vec4(vColor, uOpacity);
    }
`

export default function DottedSurface({ className = '', ...props }) {
    const { isDark } = useTheme()
    const containerRef = useRef(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        // Light-gray dots on the dark UI; near-black dots in light mode.
        const dot = isDark ? 0.8 : 0.1

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            10000,
        )
        camera.position.set(0, 355, 1220)

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000000, 0) // transparent → page bg shows through
        el.appendChild(renderer.domElement)

        // Build the grid geometry.
        const positions = []
        const grid = []
        const colors = []
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions.push(
                    ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
                    0,
                    iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
                )
                grid.push(ix, iy)
                colors.push(dot, dot, dot)
            }
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('aGrid', new THREE.Float32BufferAttribute(grid, 2))
        geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3))

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                // Subtle enough to sit behind full-page content while readable.
                uOpacity: { value: 0.6 },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
            depthWrite: false,
        })

        const points = new THREE.Points(geometry, material)
        scene.add(points)

        // StrictMode-safe loop: each mount owns its own raf id + disposed flag,
        // so cleanup fully stops THIS loop (fixes the stale-id leak).
        let raf = 0
        let disposed = false
        const animate = () => {
            if (disposed) return
            material.uniforms.uTime.value += 0.1
            renderer.render(scene, camera)
            raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            disposed = true
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', handleResize)
            geometry.dispose()
            material.dispose()
            renderer.dispose()
            if (renderer.domElement.parentNode === el) {
                el.removeChild(renderer.domElement)
            }
        }
    }, [isDark])

    return (
        <div
            ref={containerRef}
            className={`pointer-events-none fixed inset-0 z-0 ${className}`}
            {...props}
        />
    )
}

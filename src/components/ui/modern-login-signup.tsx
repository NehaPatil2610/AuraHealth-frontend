import React, { useEffect, useRef, useState } from 'react';
import AuraHealthLogo from '../../components/AuraHealthLogo';
import { Heart, Stethoscope, Loader2, ArrowLeft } from 'lucide-react';

export interface ModernAuthProps {
  initialMode?: 'signin' | 'signup';
  isLoading?: boolean;
  authError?: string | null;
  onBackToLanding?: () => void;
  onLogin?: (email: string, password: string) => void;
  onRegister?: (name: string, email: string, password: string, role: string) => void;
  onGoogleLogin?: () => void;
  onSwitchMode?: (mode: 'signin' | 'signup') => void;
}

export default function ModernAuth({
  initialMode = 'signin',
  isLoading = false,
  authError = null,
  onBackToLanding,
  onLogin,
  onRegister,
  onGoogleLogin,
  onSwitchMode,
}: ModernAuthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLogin, setIsLogin] = useState(initialMode === 'signin');
  const [selectedRole, setSelectedRole] = useState('PATIENT');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setIsLogin(initialMode === 'signin');
  }, [initialMode]);

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => 
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (isLogin) {
      onLogin?.(formData.email, formData.password);
    } else {
      onRegister?.(formData.name, formData.email, formData.password, selectedRole.toLowerCase());
    }
  };

  const switchMode = (mode: 'signin' | 'signup') => {
    setIsLogin(mode === 'signin');
    onSwitchMode?.(mode);
  };

  useEffect(() => {
    let active = true;
    let renderer: any;
    let geometry: any;
    let material: any;
    let scene: any;
    let camera: any;
    let animationId: number;

    const initThree = (THREE: any) => {
      if (!canvasRef.current || !active) return;
      const canvas = canvasRef.current;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth * 2, window.innerHeight * 2) },
        u_opacities: { value: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1.0] },
        u_colors: { value: [
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1)
        ] },
        u_total_size: { value: 20.0 },
        u_dot_size: { value: 6.0 },
        u_reverse: { value: 0 }
      };

      material = new THREE.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          uniform vec2 u_resolution;
          out vec2 fragCoord;
          void main() {
            gl_Position = vec4(position, 1.0);
            fragCoord = (position.xy + 1.0) * 0.5 * u_resolution;
            fragCoord.y = u_resolution.y - fragCoord.y;
          }
        `,
        fragmentShader: `
          precision mediump float;
          in vec2 fragCoord;

          uniform float u_time;
          uniform float u_opacities[10];
          uniform vec3 u_colors[6];
          uniform float u_total_size;
          uniform float u_dot_size;
          uniform vec2 u_resolution;
          uniform int u_reverse;

          out vec4 fragColor;

          float PHI = 1.61803398874989484820459;
          float random(vec2 xy) {
              return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
          }

          void main() {
              vec2 st = fragCoord.xy;
              st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
              st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

              float opacity = step(0.0, st.x) * step(0.0, st.y);

              vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

              float frequency = 5.0;
              float show_offset = random(st2);
              float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
              opacity *= u_opacities[int(rand * 10.0)];
              opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
              opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

              vec3 color = u_colors[int(show_offset * 6.0)];

              float animation_speed_factor = 3.0;
              vec2 center_grid = u_resolution / 2.0 / u_total_size;
              float dist_from_center = distance(center_grid, st2);

              float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

              float current_timing_offset = timing_offset_intro;
              opacity *= step(current_timing_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);

              fragColor = vec4(color, opacity * 0.6); // Made slightly more subtle
              fragColor.rgb *= fragColor.a;
          }
        `,
        uniforms: uniforms,
        glslVersion: THREE.GLSL3,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor,
        transparent: true
      });

      geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const startTime = performance.now();
      const animate = () => {
        if (!active) return;
        animationId = requestAnimationFrame(animate);
        uniforms.u_time.value = (performance.now() - startTime) / 1000.0;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth * 2, window.innerHeight * 2);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    if ((window as any).THREE) {
      const cleanUp = initThree((window as any).THREE);
      return () => {
        active = false;
        if (cleanUp) cleanUp();
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer) renderer.dispose();
        if (geometry) geometry.dispose();
        if (material) material.dispose();
      };
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).THREE) {
          const cleanUp = initThree((window as any).THREE);
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, []);

  /* ─── shared button styles ─── */
  const socialBtn: React.CSSProperties = {
    width:"100%", padding:"0.65rem", borderRadius:6,
    border:"1px solid #333", background:"transparent", color:"#fff",
    fontWeight:500, fontSize:"0.875rem", cursor: isLoading ? "not-allowed" : "pointer",
    display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
    marginBottom:"0.4rem", opacity: isLoading ? 0.5 : 1
  };
  const input: React.CSSProperties = {
    width:"100%", padding:"0.65rem 0.85rem", borderRadius:6,
    border:"1px solid #333", background:"#000", color:"#fff",
    fontSize:"0.875rem", outline:"none",
  };

  /* ─── Google SVG ─── */
  const GoogleIcon = (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const Logo = (
    <div style={{marginBottom:"0.75rem", display: 'flex', justifyContent: 'center'}}>
      <AuraHealthLogo size={48} />
    </div>
  );
  
  const Footer = (
    <div style={{marginTop:"0.85rem",fontSize:"0.75rem",color:"#666",lineHeight:1.5,textAlign:"center"}}>
      By proceeding, you agree to creating an account<br/>subject to our{" "}
      <a href="#" style={{color:"#888"}}>Terms of Service</a> and <a href="#" style={{color:"#888"}}>Privacy Policy</a>.
    </div>
  );

  return (
    <div style={{position:"relative",width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#09090b",color:"#fff",fontFamily:"'Inter',-apple-system,sans-serif"}}>

      {onBackToLanding && (
          <button
              onClick={onBackToLanding}
              style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.875rem', color: '#999', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8 }}
          >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back
          </button>
      )}

      {/* WebGL Dot canvas */}
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,zIndex:0}}/>

      {/* Vignette */}
      <div style={{position:"absolute",inset:0,zIndex:1,background:"radial-gradient(circle at center,rgba(9,9,11,0.6) 0%,rgba(9,9,11,1) 100%)",pointerEvents:"none"}}/>

      {/* Modal card */}
      <div style={{position:"relative",zIndex:2,background:"#121212",borderRadius:12,padding:"2rem",width:"100%",maxWidth:400,boxShadow:"0 10px 40px rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",alignItems:"center",border:"1px solid #222"}}>

        <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
          {Logo}
          <h1 style={{fontSize:"1.35rem",fontWeight:600,marginBottom:"0.25rem",letterSpacing:"-0.025em"}}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p style={{fontSize:"0.85rem",color:"#888",marginBottom:"0.85rem",lineHeight:1.5}}>
            {isLogin ? 'Welcome back to your workspace.' : 'Join the future of precision healthcare.'}
          </p>

          {authError && (
              <div style={{ width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, color: '#f87171', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {authError}
              </div>
          )}

          {/* Role Selector */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                  type="button"
                  onClick={() => !isLoading && setSelectedRole('PATIENT')}
                  disabled={isLoading}
                  style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.85rem', borderRadius: 8, border: '1px solid', cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      ...(selectedRole === 'PATIENT' ? { borderColor: 'rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { borderColor: '#27272a', background: 'rgba(9, 9, 11, 0.4)', color: '#71717a' })
                  }}
              >
                  <Heart style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Patient</span>
              </button>
              <button
                  type="button"
                  onClick={() => !isLoading && setSelectedRole('DOCTOR')}
                  disabled={isLoading}
                  style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.85rem', borderRadius: 8, border: '1px solid', cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      ...(selectedRole === 'DOCTOR' ? { borderColor: 'rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { borderColor: '#27272a', background: 'rgba(9, 9, 11, 0.4)', color: '#71717a' })
                  }}
              >
                  <Stethoscope style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Doctor</span>
              </button>
          </div>

          <form onSubmit={handleSubmit} style={{width:"100%",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
            {!isLogin && (
              <input style={input} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={updateField} required disabled={isLoading} />
            )}
            <input style={input} type="email" name="email" placeholder="name@work-email.com" value={formData.email} onChange={updateField} required disabled={isLoading} />
            <input style={input} type="password" name="password" placeholder="Password" value={formData.password} onChange={updateField} required disabled={isLoading} />
            
            <button type="submit" disabled={isLoading} style={{width:"100%",padding:"0.65rem",borderRadius:6,border:"none",background:"#10b981",color:"#fff",fontWeight:600,fontSize:"0.875rem",cursor: isLoading ? "not-allowed" : "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isLoading ? 0.7 : 1}}>
              {isLoading && <Loader2 className="animate-spin" style={{width: 16, height: 16}} />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div style={{display: 'flex', alignItems: 'center', width: '100%', margin: '1rem 0', gap: '0.75rem'}}>
            <div style={{flex: 1, height: 1, background: '#222'}} />
            <span style={{fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em'}}>or continue with</span>
            <div style={{flex: 1, height: 1, background: '#222'}} />
          </div>

          <button type="button" onClick={onGoogleLogin} disabled={isLoading} style={socialBtn}>{GoogleIcon} Continue with Google</button>

          <div style={{marginTop:"1.25rem",fontSize:"0.875rem",color:"#888"}}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={()=>switchMode(isLogin ? 'signup' : 'signin')} style={{color:"#fff",fontWeight:500,background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",fontSize:"inherit"}}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
          {Footer}
        </div>
      </div>
    </div>
  );
}

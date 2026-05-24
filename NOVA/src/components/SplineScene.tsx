import React, { Suspense, lazy } from 'react'

// Lazy-load the heavy Splinetool dependency
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="spline-loader">
          <div className="spinner"></div> Loading 3D Scene...
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}

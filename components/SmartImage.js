'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function SmartImage(props){
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={!loaded ? 'skeleton' : ''}>
      <Image {...props} onLoadingComplete={()=> setLoaded(true)} />
    </div>
  );
}

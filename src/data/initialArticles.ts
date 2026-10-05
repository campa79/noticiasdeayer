import { Article, ClassifiedAd } from '../types/blog';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'noticia-1',
    slug: 'el-hombre-pisa-la-luna-apolo-11',
    title: '¡PISARON LA LUNA! EL HOMBRE CONQUISTA EL SUELO DE OTRO MUNDO',
    subtitle: 'HAZAÑA CÓSMICA DEL SIGLO XX',
    copete: 'A las 22:56 hora argentina de anoche, el astronauta Neil Armstrong descendió la escalerilla del módulo lunar "Águila" y estampó la primera huella humana sobre el polvo ceniciento del Mar de la Tranquilidad, cumpliendo el sueño más audaz de la humanidad.',
    content: [
      'Un silencio expectante envolvía a millones de hogares frente a las pantallas en blanco y negro y los receptores de radio a válvulas cuando las palabras resonaron desde más de 380.000 kilómetros: "Un pequeño paso para un hombre, un gran salto para la humanidad". La proeza del Apolo 11 marca el inicio de una nueva era geológica y cósmica.',
      'El módulo lunar había tocado suelo cuatro horas antes, maniobrado manualmente por Armstrong tras sortear un cráter poblado de rocas filosas. A su lado, Edwin "Buzz" Aldrin asistía con serenidad de acero mientras las reservas de combustible del motor de descenso descendían a menos del dos por ciento.',
      'Veinte minutos después del descenso inicial, Aldrin se unió a su comandante en la superficie lunar. Juntos desplegaron la bandera y un conjunto de instrumentos científicos para medir la sismicidad y el viento solar, mientras el tercer tripulante, Michael Collins, orbitaba en soledad a bordo del módulo de mando "Columbia".',
      'En las calles de Buenos Aires y en las principales capitales del globo, la multitud se congregó en cafés y plazas para comentar con asombro la transmisión. Los telescopios de los observatorios astronómicos se vieron colmados de curiosos intentando atisbar la pálida luna llena que ahora albergaba vida humana.'
    ],
    pullQuote: '«Un pequeño paso para un hombre, un gran salto para la humanidad». — Neil Armstrong desde el Mar de la Tranquilidad.',
    author: 'Ernesto Sabato de la Redacción',
    authorRole: 'Corresponsal de Asuntos Científicos',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '21 de Julio de 1969',
    isoDate: '1969-07-21',
    epochYear: 1969,
    category: 'Ciencia & Misterio',
    coverImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'Armstrong y Aldrin desplegando instrumental sobre el suelo lunar. (Foto de Archivo NASA - Transmisión Vía Satélite)',
    gallery: [
      {
        id: 'gal-1-1',
        url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&auto=format&fit=crop&q=80',
        caption: 'La Tierra vista elevándose sobre el horizonte lunar, capturada desde la nave orbital.'
      },
      {
        id: 'gal-1-2',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
        caption: 'El centro de control de Cabo Kennedy estalla en vítores tras la confirmación del contacto lunar.'
      },
      {
        id: 'gal-1-3',
        url: 'https://images.unsplash.com/photo-1517976487507-5b3af140ba4e?w=900&auto=format&fit=crop&q=80',
        caption: 'El cohete Saturno V en la plataforma de lanzamiento minutos antes del histórico despegue.'
      }
    ],
    featured: true,
    readTimeMinutes: 5,
    edition: 'Edición Extraordinaria',
    tags: ['Apolo 11', 'Espacio', 'Historia Mundial', 'NASA', 'Luna'],
    viewsCount: 1420,
    comments: [
      {
        id: 'com-1',
        author: 'Don Horacio Benítez',
        city: 'Barrio Norte',
        date: '21 de Julio de 1969',
        text: '¡Memorable! Nos quedamos despiertos con toda la familia hasta las tantas de la madrugada. Lo que antes era pura fantasía de Julio Verne hoy es realidad en nuestras retinas.'
      },
      {
        id: 'com-2',
        author: 'Clara Vignale',
        city: 'Rosario',
        date: '22 de Julio de 1969',
        text: 'Es un triunfo del ingenio humano. Espero que este paso una al mundo en una era de paz duradera.'
      }
    ]
  },
  {
    id: 'noticia-2',
    slug: 'el-concierto-de-la-terraza-the-beatles',
    title: 'LOS CUATRO DE LIVERPOOL PARALIZAN LONDRES DESDE LA TERRAZA DE SAVILE ROW',
    subtitle: 'CONCIERTO IMPROVISADO EN LAS ALTURAS',
    copete: 'Al mediodía de ayer, The Beatles sorprendieron a empleados, oficinistas y peatones londinenses con un recital improvisado en el tejado de sus oficinas de Apple Corps, desatando el caos de tránsito y la ovación popular.',
    content: [
      'Sin previo aviso ni boleterías, las notas crudas y enérgicas de "Get Back" comenzaron a caer como un vendaval desde el techo del edificio número 3 de Savile Row. La gente detuvo su marcha, los oficinistas treparon a las cornisas y el tránsito se detuvo por completo.',
      'John Lennon, con un abrigo de piel marrón prestado por Yoko Ono, y Paul McCartney, exultante y afinado, compartieron micrófono junto a George Harrison y Ringo Starr. En los teclados, el extraordinario Billy Preston aportó el toque soul que electrizó el frío aire invernal.',
      'Tras 42 minutos de intensa música que incluyó "Don’t Let Me Down" y "I’ve Got a Feeling", la policía metropolitana intervino a pedido de comerciantes quejosos del ruido. John Lennon se despidió con una sonrisa irónica: "Me gustaría dar las gracias en nombre del grupo y de nosotros mismos, y espero que hayamos pasado la audición".',
      'Testigos aseguran que este podría ser el último acto público de la banda más trascendental de la música moderna, cuyo legado continúa redefiniendo la cultura juvenil de esta década.'
    ],
    pullQuote: '«Espero que hayamos pasado la audición». — John Lennon despidiéndose ante la mirada perpleja de los oficiales.',
    author: 'Mariano Del Bosque',
    authorRole: 'Crítico de Música Popular & Artes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    date: '31 de Enero de 1969',
    isoDate: '1969-01-31',
    epochYear: 1969,
    category: 'Cultura & Música',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'Amplificadores al tope sobre las maderas del tejado londinense. (Foto de la Agencia Reuter)',
    gallery: [
      {
        id: 'gal-2-1',
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80',
        caption: 'La multitud apiñada en las calles adyacentes alzando la vista hacia el cielo.'
      },
      {
        id: 'gal-2-2',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
        caption: 'Guitarras eléctricas resonando en el corazón financiero británico.'
      }
    ],
    featured: false,
    readTimeMinutes: 4,
    edition: 'Edición Vespertina',
    tags: ['Beatles', 'Rock', 'Londres', 'Música', 'Savile Row'],
    viewsCount: 980,
    comments: [
      {
        id: 'com-2-1',
        author: 'Julián Castro',
        city: 'San Telmo',
        date: '1 de Febrero de 1969',
        text: '¡Qué momento irrepetible! La juventud de hoy está viviendo una verdadera revolución cultural.'
      }
    ]
  },
  {
    id: 'noticia-3',
    slug: 'descubrimiento-tumba-tutankamon-1922',
    title: '«¡VEO COSAS MARAVILLOSAS!»: HALLAN LA TUMBA INTACTA DEL FARAÓN DE ORO EN EL VALLE DE LOS REYES',
    subtitle: 'EL ARQUEÓLOGO HOWARD CARTER DESCORRE EL VELO DE TRES MIL AÑOS',
    copete: 'Tras un lustro de excavaciones infructuosas en el desierto egipcio, la expedición británica financiada por Lord Carnarvon ha abierto una cámara sellada repleta de cofres dorados, carruajes de guerra y el sarcófago del niño rey.',
    content: [
      'Al filo de la tarde, Howard Carter practicó una pequeña abertura con una barra de hierro sobre el yeso sellado con el sello de la necrópolis real. Introdujo una vela en la penumbra asfixiante de milenios y guardó un largo silencio.',
      '—¿Puede usted ver algo? —preguntó ansioso Lord Carnarvon a sus espaldas.',
      '—Sí —respondió Carter con voz temblorosa—, veo cosas maravillosas. Tronos de oro bruñido, animales extraños con ojos de cristal, lechos fúnebres labrados y estatuas de centinelas de ébano custodian el sueño del faraón Tutankamón.',
      'El hallazgo resulta un milagro arqueológico sin precedentes, pues a diferencia de casi la totalidad de las tumbas reales del Valle, esta cámara subterránea escapó a la codicia de los saqueadores de la antigüedad por quedar sepultada bajo los escombros de una construcción posterior.',
      'Científicos de todo el orbe se alistan para viajar a Luxor mientras en El Cairo se preparan rigurosos inventarios para trasladar este tesoro invaluable que promete reescribir la historia del Imperio Nuevo.'
    ],
    pullQuote: '«En todas direcciones había el resplandor del oro; por doquier prodigios acumulados durante milenios». — Cuaderno de notas de Howard Carter.',
    author: 'Prof. Aurelio Mansilla',
    authorRole: 'Enviado Especial a Oriente Medio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    date: '26 de Noviembre de 1922',
    isoDate: '1922-11-26',
    epochYear: 1922,
    category: 'Historia',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'Ruinas milenarias y excavaciones en la garganta rocosa del Valle de los Reyes.',
    gallery: [
      {
        id: 'gal-3-1',
        url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=900&auto=format&fit=crop&q=80',
        caption: 'La máscara funeraria de oro macizo e incrustaciones de lapislázuli hallada en el tercer ataúd.'
      },
      {
        id: 'gal-3-2',
        url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=900&auto=format&fit=crop&q=80',
        caption: 'Pasadizo de piedra caliza que conduce a la antecámara del sepulcro.'
      }
    ],
    featured: true,
    readTimeMinutes: 6,
    edition: 'Edición Matutina',
    tags: ['Egipto', 'Arqueología', 'Tutankamón', 'Carter', 'Misterio'],
    viewsCount: 1890,
    comments: [
      {
        id: 'com-3-1',
        author: 'Dr. Guillermo Estévez',
        city: 'La Plata',
        date: '27 de Noviembre de 1922',
        text: 'La humanidad asiste a una lección de humildad y belleza eterna. Felicitaciones a nuestro corresponsal por la vibrante crónica.'
      }
    ]
  },
  {
    id: 'noticia-4',
    slug: 'inauguran-el-gran-teatro-colon-buenos-aires',
    title: 'GALA INMORTAL: ABRE SUS PUERTAS EL MAGNO TEATRO COLÓN CON LA ÓPERA AÍDA',
    subtitle: 'BUENOS AIRES BRILLA EN LA CÚSPIDE DEL ARTE MUNDIAL',
    copete: 'Con la presencia del Presidente José Figueroa Alcorta, la orquesta dirigida por Luigi Mancinelli deslumbró a la distinguida concurrencia en la sala lírica dotada de una acústica perfecta que ya es orgullo nacional.',
    content: [
      'La noche del 25 de mayo quedará grabada en letras de bronce en los anales de la cultura hispanoamericana. Frente a la remozada Plaza Lavalle, carruajes de gala y elegantes damas con estolas de armiño y caballeros de frac colmaron la imponente escalinata de mármol de Carrara.',
      'El interior del coliseo es una maravilla de proporciones italo-francesas: la sala en forma de herradura, las lámparas de cristal de Murano y el techo pintado por Marcel Jambon transportaron a los presentes a una dimensión celestial desde el primer acorde del preludio de Verdi.',
      'El público ovacionó de pie a la soprano Lucia Crestani en el papel de la princesa etíope. Críticos extranjeros presentes destacaron que la resonancia y pureza tímbrica del Colón supera holgadamente a la de la Ópera de París y La Scala de Milán.',
      'La velada culminó con una recepción diplomática en el Salón Dorado donde se brindó por el porvenir de las artes en la República Argentina.'
    ],
    pullQuote: '«Una sala que respira con la voz del cantante; cada nota flota como terciopelo en el aire». — Maestro Luigi Mancinelli.',
    author: 'Doña Victoria Ocampo y Luján',
    authorRole: 'Cronista de Bellas Artes & Salones',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    date: '26 de Mayo de 1908',
    isoDate: '1908-05-26',
    epochYear: 1908,
    category: 'Sociedad & Crónicas',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'Fachada iluminada del Teatro Colón durante la noche inaugural. (Grabado de época)',
    gallery: [
      {
        id: 'gal-4-1',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
        caption: 'Vista de los palcos y la herradura dorada antes del levantamiento del telón.'
      },
      {
        id: 'gal-4-2',
        url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=900&auto=format&fit=crop&q=80',
        caption: 'Marmolería y arañas importadas en el fastuoso foyer principal.'
      }
    ],
    featured: false,
    readTimeMinutes: 4,
    edition: 'Edición Especial del Centenario',
    tags: ['Teatro Colón', 'Buenos Aires', 'Ópera', 'Aída', '1908'],
    viewsCount: 1120
  },
  {
    id: 'noticia-5',
    slug: 'el-concorde-cruza-el-atlantico-a-dos-veces-la-velocidad-del-sonido',
    title: 'EL PÁJARO BLANCO DEL FUTURO: EL CONCORDE VUELA DE PARÍS A NUEVA YORK EN TIEMPO RÉCORD',
    subtitle: 'CRUZAR EL OCÉANO MIENTRAS SE TOMA CHAMPAGNE A 18.000 METROS',
    copete: 'El prodigio supersónico anglo-francés completó su travesía comercial inaugural volando a Mach 2. Los pasajeros vieron la curvatura de la Tierra y aterrizaron antes de la hora local en que despegaron, desafiando el tiempo.',
    content: [
      'Con su esbelto fuselaje y sus alas en delta que evocan a una saeta celestial, el Concorde rugió ayer al mediodía sobre la pista de Roissy Charles de Gaulle para elevarse vertiginosamente hacia la estratosfera.',
      'Al superar la barrera del sonido sobre el océano Atlántico, el silencioso murmullo en cabina apenas dejó entrever el hito: un velocímetro digital en la mampara frontal marcó con orgullo 2.170 kilómetros por hora.',
      'A bordo, los comensales disfrutaron de caviar de beluga, suprema de faisán y vinos añejos en vajilla de porcelana de Limoges especialmente diseñada para evitar derrames durante la aceleración supersónica.',
      'Este avance promete acortar para siempre las distancias entre los continentes, inaugurando una era donde ningún rincón del planeta estará a más de pocas horas de viaje.'
    ],
    pullQuote: '«A 60.000 pies de altura, el cielo adquiere un tono azul cobalto profundo y el tiempo parece viajar hacia atrás». — Comandante Pierre Dumesnil.',
    author: 'Capitán Raúl Arismendi',
    authorRole: 'Corresponsal de Aviación & Tecnología',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    date: '22 de Enero de 1976',
    isoDate: '1976-01-22',
    epochYear: 1976,
    category: 'Ciencia & Misterio',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'La silueta inconfundible del Concorde rasgando los cielos atlánticos.',
    gallery: [
      {
        id: 'gal-5-1',
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&auto=format&fit=crop&q=80',
        caption: 'La trompa basculante ajustada para el aterrizaje de precisión en el aeropuerto JFK.'
      }
    ],
    featured: false,
    readTimeMinutes: 3,
    edition: 'Edición Vespertina',
    tags: ['Concorde', 'Aviación', 'Supersónico', 'París', 'Tecnología'],
    viewsCount: 760
  },
  {
    id: 'noticia-6',
    slug: 'argentina-campeon-mundial-mexico-1986',
    title: '¡GLORIA ETERNA! ARGENTINA CAMPEÓN DEL MUNDO EN EL AZTECA CON LA OBRA MAESTRA DE MARADONA',
    subtitle: 'VICTORIA 3 A 2 FRENTE A ALEMANIA FEDERAL',
    copete: 'En un partido épico no apto para cardíacos, Jorge Burruchaga definió una corrida inmortal tras pase milimétrico de Diego Armando Maradona, consagrando a la celeste y blanca en la cima del fútbol universal ante 115.000 espectadores.',
    content: [
      'El mediodía ardiente del Coloso de Santa Úrsula fue el escenario del triunfo más conmovedor del deporte argentino. Tras los goles de José Luis Brown de cabeza y Jorge Valdano de contragolpe, la máquina alemana empató en una ráfaga con tantos de Rummenigge y Völler.',
      'Cuando el aire escaseaba y las piernas flaqueaban, el genio del muchacho de Villa Fiorito frotó la lámpara: rodeado por tres camisetas verdes, Diego inventó un pase en cortada que dejó a Burruchaga mano a mano con Harald Schumacher.',
      'El toque sutil hacia la red a los 39 minutos del segundo tiempo desató el llanto y la algarabía en todo el territorio nacional, desde Jujuy hasta Tierra del Fuego. El Obelisco de Buenos Aires congregó a más de un millón de almas cantando bajo una lluvia de papelitos.',
      'Diego Maradona alzó la Copa del Mundo con las dos manos hacia el cielo mexicano, inmortalizando un torneo donde rubricó el gol más perfecto de la historia ante los ingleses.'
    ],
    pullQuote: '«La pelota siempre al diez, que si el diez está contento, todo un pueblo es feliz». — Crónica de transmisión de Víctor Hugo Morales.',
    author: 'Dante Panzeri (H.)',
    authorRole: 'Jefe de Redacción Deportiva',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    date: '30 de Junio de 1986',
    isoDate: '1986-06-30',
    epochYear: 1986,
    category: 'Deportes',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
    coverCaption: 'Festejos multitudinarios y papel picado en las calles tras la consagración.',
    gallery: [
      {
        id: 'gal-6-1',
        url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=900&auto=format&fit=crop&q=80',
        caption: 'La emoción en los vestuarios de la delegación argentina tras el silbatazo final.'
      },
      {
        id: 'gal-6-2',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&auto=format&fit=crop&q=80',
        caption: 'Pancartas y bocinazos interminables en la Avenida 9 de Julio.'
      }
    ],
    featured: true,
    readTimeMinutes: 5,
    edition: 'Edición Especial de Campeonato',
    tags: ['Maradona', 'México 86', 'Fútbol', 'Campeón', 'Argentina'],
    viewsCount: 3100,
    comments: [
      {
        id: 'com-6-1',
        author: 'Roberto "Tito" Falcone',
        city: 'Boedo',
        date: '30 de Junio de 1986',
        text: '¡Gracias Diego, gracias muchachos! Abrazo a todos los vecinos en la esquina del café.'
      }
    ]
  }
];

export const INITIAL_CLASSIFIEDS: ClassifiedAd[] = [
  {
    id: 'ad-1',
    category: 'AUTOMOTORES',
    title: 'Se Vende Ford Falcon Mod. 1972',
    description: 'Motor 188 impecable, tapizado cuero original de fábrica, 4 neumáticos radiales recién colocados. Listo para transferir.',
    contact: 'Tratar en Taller San Cristóbal o llamar al 45-8912.',
    price: '$ 850.000 m/n'
  },
  {
    id: 'ad-2',
    category: 'INMUEBLES & ALQUILERES',
    title: 'Departamento 3 Ambientes con Balcón',
    description: 'Pisos de parquet de roble, cocina a gas con campana de bronce, vista abierta a plaza. A metros del tranvía.',
    contact: 'Inmobiliaria La Porteña - Calle Corrientes 1420.',
    price: 'Alquiler módico'
  },
  {
    id: 'ad-3',
    category: 'OBJETOS & NOVEDADES',
    title: 'Máquina de Escribir Remington Rand',
    description: 'Cinta bicolor nueva negra y roja. Teclas cromadas, estuche de cuero portátil. Ideal estudiantes de abogacía o periodistas.',
    contact: 'Librería El Ateneo del Pasado.',
    price: '$ 45.000'
  },
  {
    id: 'ad-4',
    category: 'SERVICIOS & OFICIOS',
    title: 'Sastrería a Medida de Don Pascual',
    description: 'Trajes cruzados, ambos de franela y sobretodos de paño inglés. Arreglos y transformaciones en 48 horas.',
    contact: 'Pasaje Barolo, Local 18.',
    price: 'Presupuestos sin cargo'
  }
];

export const VINTAGE_EPHEMERIDES = [
  {
    year: '1895',
    text: 'Primera proyección pública de cine por los hermanos Lumière en París.'
  },
  {
    year: '1913',
    text: 'Se inaugura la Línea A del Subterráneo de Buenos Aires, primera de Iberoamérica.'
  },
  {
    year: '1930',
    text: 'Carlos Gardel graba en los estudios Odeón los tangos "Yira, Yira" y "Mano a Mano".'
  },
  {
    year: '1958',
    text: 'Se funda la NASA para liderar la exploración espacial civil y científica.'
  }
];

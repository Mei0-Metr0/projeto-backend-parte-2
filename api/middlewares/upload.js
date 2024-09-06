import multer from 'multer';

const storage = multer.diskStorage({
  /*
    cb: callback para definir o caminho do diretório;
    file: o arquivo que está sendo enviado;
    req: a requisição HTTP.

    A função passa null como primeiro argumento do cb (indicando que não houve erro), e 'uploads/' 
    como segundo argumento, que é o diretório onde os arquivos serão salvos.
  */
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: fileFilter,
});

export default upload;
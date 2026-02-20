import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { Produto } from "../../../../types/types";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import "./styles.scss";

const categorias = ["Alimentos", "Bebidas", "Limpeza", "Higiene", "Outros"];

type Props = {
  produto?: Produto | null;
  onSubmit: (produto: Produto) => void;
};

export default function CadastroProdutos({ produto, onSubmit }: Props) {
  const [formData, setFormData] = useState<Omit<Produto, "id">>({
    nome: "",
    categoria: "",
    preco: 0,
    descricao: "",
    imagem: "",
    quantidade: 0,
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco,
        descricao: produto.descricao || "",
        imagem: produto.imagem || "",
        quantidade: produto.quantidade ?? 0,
      });
    } else {
      setFormData({
        nome: "",
        categoria: "",
        preco: 0,
        descricao: "",
        imagem: "",
        quantidade: 0,
      });
    }
  }, [produto]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "preco" || name === "quantidade" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagem: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (produto) {
      onSubmit({ ...formData, id: produto.id });
    } else {
      onSubmit({ ...formData });
    }

    if (!produto) {
      setFormData({
        nome: "",
        categoria: "",
        preco: 0,
        descricao: "",
        imagem: "",
        quantidade: 0
      });
    }
  };

  return (
    <Box className="cadastro-container">
      <form onSubmit={handleSubmit} className="cadastro-form">
        <TextField
          fullWidth
          label="Nome do Produto"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            name="categoria"
            value={formData.categoria}
            onChange={handleSelectChange}
            label="Categoria"
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            type="number"
            label="Preço"
            name="preco"
            value={formData.preco}
            onChange={handleInputChange}
            required
            margin="normal"
            inputProps={{ step: "0.01", min: "0" }}
          />

          <TextField
            fullWidth
            type="number"
            label="Estoque (Quantidade)"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleInputChange}
            required
            margin="normal"
            inputProps={{ step: "1", min: "0" }}
          />
        </Box>

        <TextField
          fullWidth
          label="Descrição"
          name="descricao"
          value={formData.descricao}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={3}
        />

        <Box border="1px solid #e0e0e0" borderRadius={1} p={2} mt={2} mb={1}>
          <Typography variant="body2" color="textSecondary" mb={1}>
            Imagem do Produto (Coloque a URL ou faça Upload)
          </Typography>

          <TextField
            fullWidth
            label="URL da Imagem"
            name="imagem"
            value={formData.imagem}
            onChange={handleInputChange}
            margin="normal"
            size="small"
          />

          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <input
              type="file"
              accept="image/*"
              id="upload-imagem"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-imagem">
              <Button variant="outlined" component="span">
                Fazer Upload de Imagem
              </Button>
            </label>

            {formData.imagem && (
              <Box
                component="img"
                src={formData.imagem}
                alt="Preview"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        </Box>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {produto ? "Atualizar Produto" : "Cadastrar Produto"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

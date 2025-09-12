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
        descricao: produto.descricao,
        imagem: produto.imagem,
        quantidade: produto.quantidade,
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "preco" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        quantidade: 0,
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            name="categoria"
            value={formData.categoria}
            onChange={handleSelectChange}
            required
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="Preço"
          name="preco"
          value={formData.preco}
          onChange={handleInputChange}
          required
          margin="normal"
          inputProps={{ step: "0.01" }}
        />

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

        <TextField
          fullWidth
          label="URL da Imagem"
          name="imagem"
          value={formData.imagem}
          onChange={handleInputChange}
          margin="normal"
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {produto ? "Atualizar Produto" : "Cadastrar Produto"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

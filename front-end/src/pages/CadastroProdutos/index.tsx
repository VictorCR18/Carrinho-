import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  TableSortLabel,
  Typography,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
import type { Produto } from "../../types/types";
import Modal from "./components/Modal";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import "./styles.scss";

const produtoService = new ProdutoService();

type Order = "asc" | "desc" | null;

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState<Order>(null);
  const [orderBy, setOrderBy] = useState<keyof Produto | null>(null);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await produtoService.list();
        setProdutos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProdutos();
  }, []);

  const handleSaveProduto = async (produto: Produto) => {
    try {
      if (produto.id) {
        const atualizado = await produtoService.update(produto, produto.id);
        setProdutos((prev) =>
          prev.map((p) => (p.id === atualizado.id ? atualizado : p)),
        );
      } else {
        const novo = await produtoService.create(produto);
        setProdutos((prev) => [...prev, novo]);
      }
      setOpen(false);
      setSelectedProduto(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Deseja realmente excluir este produto?"))
      return;
    try {
      await produtoService.delete(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setOpen(true);
  };

  const handleRequestSort = (property: keyof Produto) => {
    if (orderBy !== property) {
      setOrder("asc");
      setOrderBy(property);
    } else {
      if (order === "asc") {
        setOrder("desc");
      } else if (order === "desc") {
        setOrder(null);
        setOrderBy(null);
      } else {
        setOrder("asc");
      }
    }
  };

  // BUSCA SEGURA: previne que a tela quebre se 'p.nome' vier vazio do banco
  const filtered = produtos.filter((p) =>
    (p.nome || "").toLowerCase().includes((search || "").toLowerCase()),
  );

  const sorted =
    order && orderBy
      ? [...filtered].sort((a, b) => {
          const aValue = a[orderBy] ?? "";
          const bValue = b[orderBy] ?? "";

          if (typeof aValue === "number" && typeof bValue === "number") {
            return order === "asc" ? aValue - bValue : bValue - aValue;
          }

          return order === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        })
      : filtered;

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box className="produtos-page">
      {/* HEADER MODERNO */}
      <Box className="actions-bar">
        <Typography variant="h5" component="h2">
          Gerenciar Produtos
        </Typography>
        <div className="actions">
          <TextField
            className="search-input"
            placeholder="Buscar produto..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={{ fontWeight: "bold", px: 3 }}
            onClick={() => {
              setSelectedProduto(null);
              setOpen(true);
            }}
          >
            Adicionar
          </Button>
        </div>
      </Box>

      {/* TABELA COM ELEVAÇÃO E HOVER */}
      <TableContainer component={Paper} className="custom-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagem</TableCell>
              <TableCell
                sortDirection={orderBy === "nome" ? order || false : false}
              >
                <TableSortLabel
                  active={orderBy === "nome"}
                  direction={orderBy === "nome" && order ? order : "asc"}
                  onClick={() => handleRequestSort("nome")}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "categoria" ? order || false : false}
              >
                <TableSortLabel
                  active={orderBy === "categoria"}
                  direction={orderBy === "categoria" && order ? order : "asc"}
                  onClick={() => handleRequestSort("categoria")}
                >
                  Categoria
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "preco" ? order || false : false}
              >
                <TableSortLabel
                  active={orderBy === "preco"}
                  direction={orderBy === "preco" && order ? order : "asc"}
                  onClick={() => handleRequestSort("preco")}
                >
                  Preço
                </TableSortLabel>
              </TableCell>

              {/* NOVA COLUNA ESTOQUE */}
              <TableCell>Estoque</TableCell>

              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((prod) => (
              <TableRow key={prod.id} hover>
                <TableCell>
                  {prod.imagem ? (
                    <Box
                      component="img"
                      src={prod.imagem}
                      alt={prod.nome}
                      sx={{
                        width: 48,
                        height: 48,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid #eee",
                        bgcolor: "#fff",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#f1f5f9",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "#94a3b8",
                      }}
                    >
                      S/ img
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{prod.nome}</TableCell>
                <TableCell>
                  <Chip
                    label={prod.categoria}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ color: "#1976d2", fontWeight: 600 }}>
                  R$ {(prod.preco || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${prod.quantidade || 0} un`}
                    color={
                      prod.quantidade && prod.quantidade > 0
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(prod)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(prod.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum produto encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Itens por página:"
        />
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProduto(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", borderBottom: "1px solid #eee", pb: 2 }}
        >
          {selectedProduto ? "Editar Produto" : "Novo Produto"}
        </DialogTitle>
        <DialogContent sx={{ pt: "24px !important" }}>
          <Modal produto={selectedProduto} onSubmit={handleSaveProduto} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

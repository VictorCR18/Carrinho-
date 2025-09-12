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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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
        setProdutos(data);
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
          prev.map((p) => (p.id === atualizado.id ? atualizado : p))
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
    if (!id) return;
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

  const filtered = produtos.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const sorted =
    order && orderBy
      ? [...filtered].sort((a, b) => {
          const aValue = a[orderBy];
          const bValue = b[orderBy];

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
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="produtos-page">
      <Box className="actions-bar">
        <h2>Gerenciar Produtos</h2>
        <div className="actions">
          <TextField
            placeholder="Buscar"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelectedProduto(null);
              setOpen(true);
            }}
          >
            Adicionar
          </Button>
        </div>
      </Box>

      <TableContainer component={Paper} className="custom-table">
        <Table>
          <TableHead>
            <TableRow>
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
              <TableCell
                sortDirection={orderBy === "descricao" ? order || false : false}
              >
                <TableSortLabel
                  active={orderBy === "descricao"}
                  direction={orderBy === "descricao" && order ? order : "asc"}
                  onClick={() => handleRequestSort("descricao")}
                >
                  Descrição
                </TableSortLabel>
              </TableCell>
              <TableCell>Imagem</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.nome}</TableCell>
                <TableCell>{prod.categoria}</TableCell>
                <TableCell>R$ {prod.preco.toFixed(2)}</TableCell>
                <TableCell>{prod.descricao}</TableCell>
                <TableCell>
                  {prod.imagem ? (
                    <img
                      src={prod.imagem}
                      alt={prod.nome}
                      width={50}
                      style={{ borderRadius: "4px" }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(prod)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(prod.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum produto encontrado
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
      >
        <DialogTitle>
          {selectedProduto ? "Editar Produto" : "Cadastrar Produto"}
        </DialogTitle>
        <DialogContent>
          <Modal produto={selectedProduto} onSubmit={handleSaveProduto} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

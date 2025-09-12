import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import type { Produto } from "../../../../types/types";
import { useCart } from "../../../../shared/components/CardContext";
import "./styles.scss";

type Props = {
  produto: Produto;
};

export default function Card({ produto }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="card-item">
      <div className="image-container">
        {produto.imagem && <img src={produto.imagem} alt={produto.nome} />}
      </div>
      <div className="card-content">
        <h6>{produto.nome}</h6>
        <div className="descricao">{produto.descricao || "-"}</div>
        <div className="preco">R$ {produto.preco.toFixed(2)}</div>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          className="btn-carrinho"
          onClick={() => addToCart(produto)}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}

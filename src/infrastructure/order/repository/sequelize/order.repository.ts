import { LIMIT_WORKER_THREADS } from "sqlite3";
import Order from "../../domain/checkout/entity/order";
import OrderItem from "../../domain/checkout/entity/order_item";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }


    async update(entity: Order): Promise<void> {
        const sequelize = OrderModel.sequelize;
        await sequelize!.transaction(async (t) => {
            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: t,
            });
            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
            await OrderItemModel.bulkCreate(items, { transaction: t });
            await OrderModel.update(
                { total: entity.total() },
                { where: { id: entity.id }, transaction: t }
            );
        });
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"],
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const items = orderModel!.items;

        const item = new OrderItem(
            items[0].id,
            items[0].name,
            items[0].price,
            items[0].product_id,
            items[0].quantity
        );

        const order = new Order(id, orderModel!.customer_id, [item]);
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        });

        const orders = orderModels.map((orderModel) => {
            const orderItems = orderModel.items.map(
                (orderItem) =>
                    new OrderItem(
                        orderItem.id,
                        orderItem.name,
                        orderItem.price,
                        orderItem.product_id,
                        orderItem.quantity
                    )
            );
            return new Order(orderModel.id, orderModel.customer_id, orderItems);
        });

        return orders;
    }
}
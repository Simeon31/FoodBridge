using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodBridge.Server.Migrations
{
    /// <inheritdoc />
    public partial class Remove_Field_ProductID_From_Table_Inventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_DonationItems_SourceDonationItemId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "InventoryItems",
                newName: "ProductId1");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryItems_ProductId",
                table: "InventoryItems",
                newName: "IX_InventoryItems_ProductId1");

            migrationBuilder.AlterColumn<int>(
                name: "SourceDonationItemId",
                table: "InventoryItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_DonationItems_SourceDonationItemId",
                table: "InventoryItems",
                column: "SourceDonationItemId",
                principalTable: "DonationItems",
                principalColumn: "DonationItemId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Products_ProductId1",
                table: "InventoryItems",
                column: "ProductId1",
                principalTable: "Products",
                principalColumn: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_DonationItems_SourceDonationItemId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Products_ProductId1",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "ProductId1",
                table: "InventoryItems",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryItems_ProductId1",
                table: "InventoryItems",
                newName: "IX_InventoryItems_ProductId");

            migrationBuilder.AlterColumn<int>(
                name: "SourceDonationItemId",
                table: "InventoryItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_DonationItems_SourceDonationItemId",
                table: "InventoryItems",
                column: "SourceDonationItemId",
                principalTable: "DonationItems",
                principalColumn: "DonationItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId");
        }
    }
}

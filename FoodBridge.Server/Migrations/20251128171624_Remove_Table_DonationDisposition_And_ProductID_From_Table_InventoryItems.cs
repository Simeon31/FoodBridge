using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodBridge.Server.Migrations
{
    /// <inheritdoc />
    public partial class Remove_Table_DonationDisposition_And_ProductID_From_Table_InventoryItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems");

            migrationBuilder.DropTable(
                name: "DonationDispositions");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "InventoryItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "InventoryItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DonationDispositions",
                columns: table => new
                {
                    DispositionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationItemId = table.Column<int>(type: "int", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DispositionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    QuantityApproved = table.Column<int>(type: "int", nullable: true),
                    QuantityRejected = table.Column<int>(type: "int", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationDispositions", x => x.DispositionId);
                    table.ForeignKey(
                        name: "FK_DonationDispositions_DonationItems_DonationItemId",
                        column: x => x.DonationItemId,
                        principalTable: "DonationItems",
                        principalColumn: "DonationItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DonationDispositions_DonationItemId",
                table: "DonationDispositions",
                column: "DonationItemId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Products_ProductId",
                table: "InventoryItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

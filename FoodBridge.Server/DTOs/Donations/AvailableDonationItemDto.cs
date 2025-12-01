namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for donation items that are available to be added to inventory.
    /// </summary>
    public class AvailableDonationItemDto
    {
        public int DonationItemId { get; set; }
        public int DonationId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public string UnitType { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
